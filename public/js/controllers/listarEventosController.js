// Importa las funciones del servicio de eventos
import {
    obtenerEventos,
    eliminarEvento
} from "../services/eventoService.js";

// Importa la función reutilizable para dar formato a las fechas
import {
    darFormatoFecha
} from "../comunes/utilidades.js";


// Se obtienen los elementos necesarios para mostrar,
// buscar y filtrar los eventos
const inputBuscar =
    document.getElementById("buscarEvento");

const selectEstado =
    document.getElementById("filtroEstado");

const cuerpoTablaEventos =
    document.getElementById("cuerpoTablaEventos");

const mensajeSinResultados =
    document.getElementById("sinResultados");


// Arreglo que guarda temporalmente los eventos
// obtenidos desde MongoDB
let eventosRegistrados = [];


// Función para obtener la clase del distintivo
// según el estado del evento
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

        mensajeSinResultados.style.display =
            "block";

        return;
    }

    // Oculta el mensaje cuando sí existen registros
    mensajeSinResultados.style.display =
        "none";


    // Recorre el arreglo de eventos
    eventos.forEach(function(evento){

        // Crea una nueva fila
        const fila =
            document.createElement("tr");

        // Guarda el estado del evento en la fila
        fila.dataset.estado =
            evento.estado || "";

        // Agrega la información del evento
        fila.innerHTML = `
            <td>
                ${evento.nombreEvento || ""}
            </td>

            <td>
                ${darFormatoFecha(evento.fechaInicio)}
            </td>

            <td>
                ${darFormatoFecha(evento.fechaFin)}
            </td>

            <td>
                ${evento.ubicacion || ""}
            </td>

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

        // Agrega la fila a la tabla
        cuerpoTablaEventos.appendChild(
            fila
        );
    });


    // Agrega los eventos a los botones dinámicos
    agregarEventosBotones();
}


// Función para consultar los eventos
async function cargarEventosRetorno(){

    try{

        // Solicita los eventos por medio del service
        const eventos =
            await obtenerEventos();

        // Guarda la lista obtenida desde MongoDB
        eventosRegistrados =
            eventos;

        // Muestra los eventos aplicando
        // los filtros actuales
        aplicarFiltros();

    } catch(error){

        console.error(
            "Error al cargar eventos:",
            error
        );

        mensajeSinResultados.textContent =
            "No fue posible cargar los eventos.";

        mensajeSinResultados.style.display =
            "block";

        Swal.fire({
            title: "Error al cargar eventos",
            text: "No fue posible obtener la información del servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para filtrar los eventos
// por nombre y por estado
function aplicarFiltros(){

    // Obtiene el texto escrito en el buscador
    const texto =
        inputBuscar.value
            .trim()
            .toLowerCase();

    // Obtiene el estado seleccionado
    const estado =
        selectEstado.value;


    // Filtra los eventos
    const eventosFiltrados =
        eventosRegistrados.filter(
            function(evento){

                const nombre =
                    (evento.nombreEvento || "")
                        .toLowerCase();

                // Verifica si coincide con el texto
                const cumpleTexto =
                    nombre.includes(texto);

                // Verifica si coincide con el estado
                const cumpleEstado =
                    estado === "" ||
                    evento.estado === estado;

                // Debe cumplir ambos filtros
                return (
                    cumpleTexto &&
                    cumpleEstado
                );
            }
        );


    // Mensaje que se muestra cuando
    // no existen coincidencias
    mensajeSinResultados.textContent =
        "No se encontraron eventos que coincidan con la búsqueda.";


    // Muestra los eventos filtrados
    mostrarEventosRetorno(
        eventosFiltrados
    );
}


// Función para ir a modificar un evento
function modificarEventoRetorno(idEvento){

    // Guarda temporalmente el identificador
    sessionStorage.setItem(
        "eventoModificarId",
        idEvento
    );

    // Redirige a la pantalla de modificación
    window.location.href =
        "/pages/Evento/modificarEvento.html";
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

        // Verifica si el usuario confirmó
        if(resultado.isConfirmed){

            try{

                // Solicita al service eliminar el evento
                const datosRespuesta =
                    await eliminarEvento(
                        idEvento
                    );


                // Muestra mensaje de éxito
                Swal.fire({
                    title: "Evento eliminado",
                    text: datosRespuesta.mensaje,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });


                // Vuelve a consultar la base de datos
                cargarEventosRetorno();

            } catch(error){

                console.error(
                    "Error al eliminar evento:",
                    error
                );

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


// Función para agregar eventos
// a los botones creados dinámicamente
function agregarEventosBotones(){

    // Obtiene todos los botones modificar
    const botonesModificar =
        cuerpoTablaEventos.querySelectorAll(
            ".boton-modificar"
        );

    // Obtiene todos los botones eliminar
    const botonesEliminar =
        cuerpoTablaEventos.querySelectorAll(
            ".btn-cancelar"
        );


    // Agrega el evento a los botones modificar
    botonesModificar.forEach(
        function(boton){

            boton.addEventListener(
                "click",
                function(){

                    modificarEventoRetorno(
                        boton.getAttribute(
                            "data-id"
                        )
                    );
                }
            );
        }
    );


    // Agrega el evento a los botones eliminar
    botonesEliminar.forEach(
        function(boton){

            boton.addEventListener(
                "click",
                function(){

                    eliminarEventoRetorno(
                        boton.getAttribute(
                            "data-id"
                        )
                    );
                }
            );
        }
    );
}


// Ejecuta la búsqueda mientras el usuario escribe
if(inputBuscar){

    inputBuscar.addEventListener(
        "input",
        aplicarFiltros
    );
}


// Ejecuta el filtro al cambiar el estado
if(selectEstado){

    selectEstado.addEventListener(
        "change",
        aplicarFiltros
    );
}


// Carga los eventos cuando se abre la página
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarEventosRetorno();
    }
);