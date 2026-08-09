// Importa las funciones del servicio de stands
import {
    obtenerStands,
    eliminarStand
} from "../services/standService.js";

// Importa la función reutilizable para quitar tildes
import {
    quitarTildes
} from "../comunes/utilidades.js";


// Se obtienen los elementos necesarios para mostrar
// y buscar stands
const inputBuscarStand =
    document.getElementById("buscarStand");

const cuerpoTablaStands =
    document.getElementById("cuerpoTablaStands");

const mensajeSinResultados =
    document.getElementById("sinResultados");

const textoPaginacion =
    document.getElementById("textoPaginacion");


// Arreglo que guarda temporalmente los stands
// obtenidos desde MongoDB
let standsRegistrados = [];


// Función para crear las filas de la tabla
function mostrarStandsRetorno(stands){

    // Limpia el contenido anterior de la tabla
    cuerpoTablaStands.innerHTML = "";

    // Verifica si existen stands para mostrar
    if(stands.length === 0){

        mensajeSinResultados.style.display =
            "block";

        textoPaginacion.textContent =
            "Total de stands: 0";

        return;
    }

    // Oculta el mensaje cuando sí existen registros
    mensajeSinResultados.style.display =
        "none";


    // Recorre todos los stands
    stands.forEach(function(stand){

        // Crea una nueva fila
        const fila =
            document.createElement("tr");


        // Agrega la información del stand
        fila.innerHTML = `
            <td>
                ${stand.evento || ""}
            </td>

            <td>
                ${stand.nombre || ""}
            </td>

            <td>
                ${stand.encargado || ""}
            </td>

            <td>
                ${stand.correo || ""}
            </td>

            <td>
                ${stand.telefono || ""}
            </td>

            <td class="celda-acciones">

                <button
                    type="button"
                    class="btn-icono boton-modificar"
                    data-id="${stand._id}"
                    title="Modificar stand">

                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    type="button"
                    class="btn-icono boton-eliminar"
                    data-id="${stand._id}"
                    title="Eliminar stand">

                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>
        `;


        // Agrega la fila a la tabla
        cuerpoTablaStands.appendChild(
            fila
        );
    });


    // Actualiza la cantidad de stands mostrados
    textoPaginacion.textContent =
        `Total de stands: ${stands.length}`;


    // Agrega los eventos a los botones dinámicos
    agregarEventosBotones();
}


// Función para consultar los stands
async function cargarStandsRetorno(){

    try{

        // Solicita los stands por medio del service
        const stands =
            await obtenerStands();

        // Guarda la lista obtenida desde MongoDB
        standsRegistrados =
            stands;

        // Aplica la búsqueda actual
        buscarStandRetorno();

    } catch(error){

        console.error(
            "Error al cargar stands:",
            error
        );

        mensajeSinResultados.textContent =
            "No fue posible cargar los stands.";

        mensajeSinResultados.style.display =
            "block";

        Swal.fire({
            title: "Error al cargar stands",
            text: "No fue posible obtener la información del servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para buscar stands mientras se escribe
function buscarStandRetorno(){

    // Obtiene el texto escrito en el buscador
    const textoBuscar =
        quitarTildes(
            inputBuscarStand
                .value
                .trim()
                .toLowerCase()
        );


    // Filtra los stands
    const standsFiltrados =
        standsRegistrados.filter(
            function(stand){

                // Une los datos que pueden utilizarse
                // para realizar la búsqueda
                const textoStand =
                    quitarTildes(
                        [
                            stand.evento,
                            stand.nombre,
                            stand.encargado,
                            stand.correo,
                            stand.telefono
                        ]
                            .join(" ")
                            .toLowerCase()
                    );


                // Verifica si coincide con la búsqueda
                return textoStand.includes(
                    textoBuscar
                );
            }
        );


    // Mensaje para búsquedas sin coincidencias
    mensajeSinResultados.textContent =
        "No se encontraron stands que coincidan con la búsqueda.";


    // Muestra únicamente los resultados filtrados
    mostrarStandsRetorno(
        standsFiltrados
    );
}


// Función para ir a modificar un stand
function modificarStandRetorno(idStand){

    // Guarda temporalmente el identificador seleccionado
    sessionStorage.setItem(
        "standModificarId",
        idStand
    );

    // Redirige a la pantalla de modificación
    window.location.href =
        "/pages/Stands/modificarStands.html";
}


// Función para confirmar la eliminación de un stand
function eliminarStandRetorno(idStand){

    Swal.fire({
        title: "¿Eliminar Stand?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"

    }).then(async function(resultado){

        // Verifica si el usuario confirmó
        if(resultado.isConfirmed){

            try{

                // Solicita al service eliminar el stand
                const datosRespuesta =
                    await eliminarStand(
                        idStand
                    );


                // Muestra mensaje de éxito
                Swal.fire({
                    title: "Stand eliminado",
                    text: datosRespuesta.mensaje,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });


                // Vuelve a consultar la base de datos
                cargarStandsRetorno();

            } catch(error){

                console.error(
                    "Error al eliminar stand:",
                    error
                );

                Swal.fire({
                    title: "Error",
                    text: "No fue posible eliminar el stand.",
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

    // Obtiene todos los botones modificar
    const botonesModificar =
        cuerpoTablaStands.querySelectorAll(
            ".boton-modificar"
        );

    // Obtiene todos los botones eliminar
    const botonesEliminar =
        cuerpoTablaStands.querySelectorAll(
            ".boton-eliminar"
        );


    // Agrega el evento a los botones modificar
    botonesModificar.forEach(
        function(boton){

            boton.addEventListener(
                "click",
                function(){

                    modificarStandRetorno(
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

                    eliminarStandRetorno(
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
if(inputBuscarStand){

    inputBuscarStand.addEventListener(
        "input",
        buscarStandRetorno
    );
}


// Carga los stands al abrir la página
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarStandsRetorno();
    }
);