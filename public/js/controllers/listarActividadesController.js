// Importa las funciones del servicio de actividades
import {
    obtenerActividades,
    eliminarActividad
} from "../services/actividadService.js";

// Importa la función reutilizable para dar formato a las horas
import {
    darFormatoHora
} from "../comunes/utilidades.js";


// Se obtienen los elementos necesarios para mostrar,
// buscar y filtrar las actividades
const inputBuscar =
    document.getElementById("buscarActividad");

const selectEstado =
    document.getElementById("filtroEstado");

const cuerpoTablaActividades =
    document.getElementById("cuerpoTablaActividades");

const mensajeSinResultados =
    document.getElementById("sinResultados");


// Arreglo que guarda temporalmente las actividades
// obtenidas desde MongoDB
let actividadesRegistradas = [];


// Función para obtener la clase del distintivo
// según el estado de la actividad
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

    // Limpia el contenido anterior de la tabla
    cuerpoTablaActividades.innerHTML = "";

    // Verifica si existen actividades
    if(actividades.length === 0){

        mensajeSinResultados.style.display =
            "block";

        return;
    }

    // Oculta el mensaje cuando sí existen registros
    mensajeSinResultados.style.display =
        "none";


    // Recorre todas las actividades
    actividades.forEach(function(actividad){

        // Crea una nueva fila
        const fila =
            document.createElement("tr");

        // Guarda el estado en la fila
        fila.dataset.estado =
            actividad.estado || "";


        // Crea el texto del horario
        const horario =
            darFormatoHora(
                actividad.horaInicio
            ) +
            " - " +
            darFormatoHora(
                actividad.horaFin
            );


        // Agrega los datos de la actividad
        fila.innerHTML = `
            <td class="celda-imagen">

                <i class="fa-regular fa-image"></i>

            </td>

            <td>
                ${actividad.nombreActividad || ""}
            </td>

            <td>
                ${horario}
            </td>

            <td>
                ${actividad.cupo || ""}
            </td>

            <td>
                -
            </td>

            <td>
                ${actividad.responsable || ""}
            </td>

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


        // Agrega la fila a la tabla
        cuerpoTablaActividades.appendChild(
            fila
        );
    });


    // Agrega los eventos a los botones dinámicos
    agregarEventosBotones();
}


// Función para consultar las actividades
async function cargarActividadesRetorno(){

    try{

        // Solicita las actividades por medio del service
        const actividades =
            await obtenerActividades();

        // Guarda la lista obtenida
        actividadesRegistradas =
            actividades;

        // Aplica los filtros actuales
        aplicarFiltros();

    } catch(error){

        console.error(
            "Error al cargar actividades:",
            error
        );

        mensajeSinResultados.textContent =
            "No fue posible cargar las actividades.";

        mensajeSinResultados.style.display =
            "block";

        Swal.fire({
            title: "Error al cargar actividades",
            text: "No fue posible obtener la información del servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para filtrar las actividades
// por texto y por estado
function aplicarFiltros(){

    // Obtiene el texto escrito
    const texto =
        inputBuscar.value
            .trim()
            .toLowerCase();

    // Obtiene el estado seleccionado
    const estado =
        selectEstado.value;


    // Filtra las actividades
    const actividadesFiltradas =
        actividadesRegistradas.filter(
            function(actividad){

                const nombre =
                    (
                        actividad.nombreActividad ||
                        ""
                    ).toLowerCase();

                const responsable =
                    (
                        actividad.responsable ||
                        ""
                    ).toLowerCase();

                const descripcion =
                    (
                        actividad.descripcion ||
                        ""
                    ).toLowerCase();


                // Verifica si coincide con la búsqueda
                const cumpleTexto =
                    texto === "" ||
                    nombre.includes(texto) ||
                    responsable.includes(texto) ||
                    descripcion.includes(texto);


                // Verifica si coincide con el estado
                const cumpleEstado =
                    estado === "" ||
                    actividad.estado === estado;


                return (
                    cumpleTexto &&
                    cumpleEstado
                );
            }
        );


    // Mensaje cuando no existen coincidencias
    mensajeSinResultados.textContent =
        "No se encontraron actividades que coincidan con la búsqueda.";


    // Muestra los resultados filtrados
    mostrarActividadesRetorno(
        actividadesFiltradas
    );
}


// Función para ir a modificar una actividad
function modificarActividadRetorno(
    idActividad,
    estado
){

    // No se permite modificar actividades
    // finalizadas o canceladas
    if(
        estado === "Finalizada" ||
        estado === "Cancelada"
    ){

        Swal.fire({
            icon: "error",
            title: "No permitido",
            text: "No se pueden modificar actividades finalizadas o canceladas."
        });

        return;
    }


    // Guarda temporalmente el identificador
    sessionStorage.setItem(
        "actividadModificarId",
        idActividad
    );


    // Redirige a la pantalla de modificación
    window.location.href =
        "/pages/Actividad/modificarActividad.html";
}


// Función para eliminar una actividad
function eliminarActividadRetorno(
    idActividad
){

    Swal.fire({
        icon: "warning",
        title: "Eliminar actividad",
        text: "¿Desea eliminar esta actividad? Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"

    }).then(async function(resultado){

        // Verifica si el usuario confirmó
        if(resultado.isConfirmed){

            try{

                // Solicita al service eliminar la actividad
                const datosRespuesta =
                    await eliminarActividad(
                        idActividad
                    );


                // Muestra mensaje de éxito
                Swal.fire({
                    icon: "success",
                    title: "Actividad eliminada",
                    text: datosRespuesta.mensaje,
                    confirmButtonText: "Aceptar"
                });


                // Vuelve a cargar la lista
                cargarActividadesRetorno();

            } catch(error){

                console.error(
                    "Error al eliminar actividad:",
                    error
                );

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


// Función para agregar los eventos
// a los botones creados dinámicamente
function agregarEventosBotones(){

    // Obtiene todos los botones editar
    const botonesEditar =
        cuerpoTablaActividades.querySelectorAll(
            ".btn-editar"
        );

    // Obtiene todos los botones eliminar
    const botonesEliminar =
        cuerpoTablaActividades.querySelectorAll(
            ".btn-eliminar"
        );


    // Agrega el evento a los botones editar
    botonesEditar.forEach(
        function(boton){

            boton.addEventListener(
                "click",
                function(){

                    // Obtiene la fila de la actividad
                    const fila =
                        boton.closest("tr");

                    modificarActividadRetorno(
                        boton.getAttribute(
                            "data-id"
                        ),
                        fila.dataset.estado
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

                    eliminarActividadRetorno(
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


// Ejecuta el filtro cuando cambia el estado
if(selectEstado){

    selectEstado.addEventListener(
        "change",
        aplicarFiltros
    );
}


// Carga las actividades al abrir la página
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarActividadesRetorno();
    }
);