// Se obtienen los elementos necesarios para mostrar,
// buscar y filtrar los eventos

const inputBuscar = document.getElementById("buscarEvento");
const selectEstado = document.getElementById("filtroEstado");
const cuerpoTablaEventos = document.getElementById("cuerpoTablaEventos");
const mensajeSinResultados = document.getElementById("sinResultados");


// Arreglo que guarda temporalmente los eventos obtenidos desde MongoDB
let eventosRegistrados = [];


// Función para obtener la clase del distintivo según el estado
function claseDelEstado(estado){

    if(estado === "Cancelado"){
        return "badge badge-cancelado";
    }

    if(estado === "Finalizado"){
        return "badge badge-finalizado";
    }

    return "badge badge-activo";
}


// Función para crear las filas de la tabla
function mostrarEventosRetorno(eventos){

    // Limpia el contenido anterior de la tabla
    cuerpoTablaEventos.innerHTML = "";

    // Verifica si existen eventos para mostrar
    if(eventos.length === 0){

        mensajeSinResultados.style.display = "block";
        return;
    }

    // Oculta el mensaje cuando sí existen registros
    mensajeSinResultados.style.display = "none";

    // Recorre el arreglo de eventos
    eventos.forEach(function(evento){

        const fila = document.createElement("tr");

        fila.dataset.estado = evento.estado || "";

        fila.innerHTML = `
            <td>${evento.nombreEvento || ""}</td>
            <td>${darFormatoFecha(evento.fechaInicio)}</td>
            <td>${darFormatoFecha(evento.fechaFin)}</td>
            <td>${evento.ubicacion || ""}</td>

            <td>
                <span class="${claseDelEstado(evento.estado)}">
                    ${evento.estado || ""}
                </span>
            </td>

            <td>

                <div class="celda-acciones">

                    <button
                        type="button"
                        class="btn-accion boton-modificar"
                        data-id="${evento._id}"
                        title="Modificar Evento">

                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        type="button"
                        class="btn-accion btn-cancelar"
                        data-id="${evento._id}"
                        title="Eliminar Evento">

                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </td>
        `;

        cuerpoTablaEventos.appendChild(fila);
    });

    // Agrega los eventos a los botones recién creados
    agregarEventosBotones();
}


// Función para consultar los eventos desde el backend
async function cargarEventosRetorno(){

    try{

        // Solicita los eventos a la API
        const eventos = await obtenerDatos("/api/eventos");

        // Guarda la lista obtenida desde MongoDB
        eventosRegistrados = eventos;

        // Muestra los eventos aplicando los filtros actuales
        aplicarFiltros();

    } catch(error){

        console.error("Error al cargar eventos:", error);

        mensajeSinResultados.textContent =
            "No fue posible cargar los eventos.";

        mensajeSinResultados.style.display = "block";

        Swal.fire({
            title: "Error al cargar eventos",
            text: "No fue posible obtener la información del servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para filtrar por nombre y por estado
function aplicarFiltros(){

    const texto = inputBuscar.value.trim().toLowerCase();
    const estado = selectEstado.value;

    const eventosFiltrados = eventosRegistrados.filter(function(evento){

        const nombre = (evento.nombreEvento || "").toLowerCase();

        const cumpleTexto = nombre.includes(texto);

        const cumpleEstado =
            estado === "" || evento.estado === estado;

        return cumpleTexto && cumpleEstado;
    });

    mensajeSinResultados.textContent =
        "No se encontraron eventos que coincidan con la búsqueda.";

    mostrarEventosRetorno(eventosFiltrados);
}


// Función para ir a modificar un evento
function modificarEventoRetorno(idEvento){

    // Guarda temporalmente el id seleccionado
    sessionStorage.setItem("eventoModificarId", idEvento);

    // Redirige a la pantalla de modificación
    window.location.href = "/pages/Evento/modificarEvento.html";
}


// Función para eliminar un evento
function eliminarEventoRetorno(idEvento){

    Swal.fire({
        title: "¿Eliminar evento?",
        text: "El evento podría tener actividades asociadas. Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"

    }).then(async function(resultado){

        if(resultado.isConfirmed){

            try{

                // Envía la solicitud al backend para eliminar
                const datosRespuesta = await eliminarDatos(`/api/eventos/${idEvento}`);

                Swal.fire({
                    title: "Evento eliminado",
                    text: datosRespuesta.mensaje,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                // Vuelve a consultar la base de datos
                cargarEventosRetorno();

            } catch(error){

                console.error("Error al eliminar evento:", error);

                Swal.fire({
                    title: "Error",
                    text: "No fue posible eliminar el evento.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        }
    });
}


// Función para agregar los eventos a los botones dinámicos
function agregarEventosBotones(){

    const botonesModificar =
        cuerpoTablaEventos.querySelectorAll(".boton-modificar");

    const botonesEliminar =
        cuerpoTablaEventos.querySelectorAll(".btn-cancelar");

    botonesModificar.forEach(function(boton){

        boton.addEventListener("click", function(){

            modificarEventoRetorno(boton.getAttribute("data-id"));
        });
    });

    botonesEliminar.forEach(function(boton){

        boton.addEventListener("click", function(){

            eliminarEventoRetorno(boton.getAttribute("data-id"));
        });
    });
}


// Ejecuta la búsqueda mientras el usuario escribe
inputBuscar.addEventListener("input", aplicarFiltros);

// Ejecuta el filtro al cambiar el estado
selectEstado.addEventListener("change", aplicarFiltros);


// Carga los eventos al abrir la página
document.addEventListener("DOMContentLoaded", function(){

    cargarEventosRetorno();
});
