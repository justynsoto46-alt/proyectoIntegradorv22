console.log("JS cargado correctamente");

// Se obtienen los elementos necesarios para mostrar,
// buscar y filtrar las actividades

const inputBuscar = document.getElementById("buscarActividad");
const selectEstado = document.getElementById("filtroEstado");
const cuerpoTablaActividades = document.getElementById("cuerpoTablaActividades");
const mensajeSinResultados = document.getElementById("sinResultados");


// Arreglo que guarda temporalmente las actividades obtenidas desde MongoDB
let actividadesRegistradas = [];


// Función para obtener la clase del distintivo según el estado
function claseDelEstado(estado){

    if(estado === "Suspendido"){
        return "badge badge-suspendido";
    }

    if(estado === "Finalizada"){
        return "badge badge-finalizada";
    }

    if(estado === "Cancelada"){
        return "badge badge-cancelada";
    }

    return "badge badge-activo";
}


// Función para crear las filas de la tabla
function mostrarActividadesRetorno(actividades){

    cuerpoTablaActividades.innerHTML = "";

    if(actividades.length === 0){

        mensajeSinResultados.style.display = "block";
        return;
    }

    mensajeSinResultados.style.display = "none";

    actividades.forEach(function(actividad){

        const fila = document.createElement("tr");

        fila.dataset.estado = actividad.estado || "";

        const horario =
            darFormatoHora(actividad.horaInicio) +
            " - " +
            darFormatoHora(actividad.horaFin);

        fila.innerHTML = `
            <td class="celda-imagen">
                <i class="fa-regular fa-image"></i>
            </td>
            <td>${actividad.nombreActividad || ""}</td>
            <td>${horario}</td>
            <td>${actividad.cupo || ""}</td>
            <td>-</td>
            <td>${actividad.responsable || ""}</td>

            <td>
                <span class="${claseDelEstado(actividad.estado)}">
                    ${actividad.estado || ""}
                </span>
            </td>

            <td>

                <div class="celda-acciones">

                    <button
                        type="button"
                        class="btn-accion btn-editar"
                        data-id="${actividad._id}"
                        title="Modificar Actividad">

                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        type="button"
                        class="btn-accion btn-eliminar"
                        data-id="${actividad._id}"
                        title="Eliminar Actividad">

                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </td>
        `;

        cuerpoTablaActividades.appendChild(fila);
    });

    agregarEventosBotones();
}


// Función para consultar las actividades desde el backend
async function cargarActividadesRetorno(){

    try{

        const actividades = await obtenerDatos("/api/actividades");

        actividadesRegistradas = actividades;

        aplicarFiltros();

    } catch(error){

        console.error("Error al cargar actividades:", error);

        mensajeSinResultados.textContent =
            "No fue posible cargar las actividades.";

        mensajeSinResultados.style.display = "block";

        Swal.fire({
            title: "Error al cargar actividades",
            text: "No fue posible obtener la información del servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para filtrar por texto y por estado
function aplicarFiltros(){

    const texto = inputBuscar.value.trim().toLowerCase();
    const estado = selectEstado.value;

    const actividadesFiltradas =
        actividadesRegistradas.filter(function(actividad){

            const nombre = (actividad.nombreActividad || "").toLowerCase();
            const responsable = (actividad.responsable || "").toLowerCase();
            const descripcion = (actividad.descripcion || "").toLowerCase();

            const cumpleTexto =
                texto === "" ||
                nombre.includes(texto) ||
                responsable.includes(texto) ||
                descripcion.includes(texto);

            const cumpleEstado =
                estado === "" || actividad.estado === estado;

            return cumpleTexto && cumpleEstado;
        });

    mensajeSinResultados.textContent =
        "No se encontraron actividades que coincidan con la búsqueda.";

    mostrarActividadesRetorno(actividadesFiltradas);
}


// Función para ir a modificar una actividad
function modificarActividadRetorno(idActividad, estado){

    // No se permite modificar actividades finalizadas o canceladas
    if(estado === "Finalizada" || estado === "Cancelada"){

        Swal.fire({
            icon: "error",
            title: "No permitido",
            text: "No se pueden modificar actividades finalizadas o canceladas."
        });

        return;
    }

    sessionStorage.setItem("actividadModificarId", idActividad);

    window.location.href = "/pages/Actividad/modificarActividad.html";
}


// Función para eliminar una actividad
function eliminarActividadRetorno(idActividad){

    Swal.fire({
        icon: "warning",
        title: "Eliminar actividad",
        text: "¿Desea eliminar esta actividad? Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"

    }).then(async function(resultado){

        if(resultado.isConfirmed){

            try{

                const datosRespuesta = await eliminarDatos(`/api/actividades/${idActividad}`);

                Swal.fire({
                    icon: "success",
                    title: "Actividad eliminada",
                    text: datosRespuesta.mensaje,
                    confirmButtonText: "Aceptar"
                });

                cargarActividadesRetorno();

            } catch(error){

                console.error("Error al eliminar actividad:", error);

                Swal.fire({
                    title: "Error",
                    text: "No fue posible eliminar la actividad.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        }
    });
}


// Función para agregar los eventos a los botones dinámicos
function agregarEventosBotones(){

    const botonesEditar =
        cuerpoTablaActividades.querySelectorAll(".btn-editar");

    const botonesEliminar =
        cuerpoTablaActividades.querySelectorAll(".btn-eliminar");

    botonesEditar.forEach(function(boton){

        boton.addEventListener("click", function(){

            const fila = boton.closest("tr");

            modificarActividadRetorno(
                boton.getAttribute("data-id"),
                fila.dataset.estado
            );
        });
    });

    botonesEliminar.forEach(function(boton){

        boton.addEventListener("click", function(){

            eliminarActividadRetorno(boton.getAttribute("data-id"));
        });
    });
}


inputBuscar.addEventListener("input", aplicarFiltros);
selectEstado.addEventListener("change", aplicarFiltros);


// Carga las actividades al abrir la página
document.addEventListener("DOMContentLoaded", function(){

    cargarActividadesRetorno();
});
