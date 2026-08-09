// Importa las funciones del servicio de administradores
import {
    obtenerAdministradores,
    eliminarAdministrador
} from "../services/administradorService.js";

// Importa la función reutilizable para eliminar tildes
import {
    quitarTildes
} from "../comunes/utilidades.js";


// Se obtienen los elementos necesarios para mostrar,
// buscar, modificar y eliminar administradores
const inputBuscarAdmin =
    document.getElementById("buscarAdmin");

const selectRol =
    document.getElementById("filtroEstado");

const cuerpoTablaAdministradores =
    document.getElementById("cuerpoTablaAdministradores");

const mensajeSinResultados =
    document.getElementById("sinResultados");


// Arreglo que guarda temporalmente los administradores
// obtenidos desde MongoDB
let administradoresRegistrados = [];


// Función para crear las filas de la tabla
function mostrarAdministradoresRetorno(administradores){

    // Limpia las filas anteriores
    cuerpoTablaAdministradores.innerHTML = "";

    // Verifica si existen administradores para mostrar
    if(administradores.length === 0){

        mensajeSinResultados.style.display = "block";
        return;
    }

    // Oculta el mensaje cuando sí existen resultados
    mensajeSinResultados.style.display = "none";


    // Recorre todos los administradores
    administradores.forEach(function(administrador){

        // Crea una nueva fila
        const fila =
            document.createElement("tr");

        // Agrega la información del administrador
        fila.innerHTML = `
            <td class="celda-imagen">
                <i class="fa-regular fa-image"></i>
            </td>

            <td>
                ${administrador.nombreCompleto || ""}
            </td>

            <td>
                ${administrador.correo || ""}
            </td>

            <td>
                ${administrador.rol || ""}
            </td>

            <td class="celda-acciones">

                <button
                    type="button"
                    class="btn-icono boton-modificar"
                    data-id="${administrador._id}"
                    title="Modificar administrador">

                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    type="button"
                    class="btn-icono boton-eliminar"
                    data-id="${administrador._id}"
                    title="Eliminar administrador">

                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>
        `;

        // Agrega la fila a la tabla
        cuerpoTablaAdministradores.appendChild(
            fila
        );
    });


    // Agrega los eventos a los botones dinámicos
    agregarEventosBotones();
}


// Función para consultar los administradores
async function cargarAdministradoresRetorno(){

    try{

        // Solicita los administradores por medio del service
        const administradores =
            await obtenerAdministradores();

        // Guarda la lista obtenida desde MongoDB
        administradoresRegistrados =
            administradores;

        // Aplica los filtros actuales
        aplicarFiltros();

    } catch(error){

        console.error(
            "Error al cargar administradores:",
            error
        );

        mensajeSinResultados.textContent =
            "No fue posible cargar los administradores.";

        mensajeSinResultados.style.display =
            "block";

        Swal.fire({
            title: "Error al cargar administradores",
            text: "No fue posible obtener la información del servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para filtrar por texto y por rol
function aplicarFiltros(){

    // Obtiene el texto escrito en el buscador
    const textoBuscar =
        quitarTildes(
            inputBuscarAdmin
                .value
                .trim()
                .toLowerCase()
        );

    // Obtiene el rol seleccionado
    const rol =
        selectRol.value;


    // Filtra los administradores
    const administradoresFiltrados =
        administradoresRegistrados.filter(
            function(administrador){

                // Une los datos que pueden utilizarse
                // para realizar la búsqueda
                const textoAdministrador =
                    quitarTildes(
                        [
                            administrador.nombreCompleto,
                            administrador.correo,
                            administrador.rol
                        ]
                            .join(" ")
                            .toLowerCase()
                    );

                // Verifica si coincide con el texto buscado
                const cumpleTexto =
                    textoAdministrador.includes(
                        textoBuscar
                    );

                // Verifica si coincide con el rol seleccionado
                const cumpleRol =
                    rol === "" ||
                    administrador.rol === rol;

                // Debe cumplir ambos filtros
                return cumpleTexto && cumpleRol;
            }
        );


    // Mensaje que se mostrará si no existen coincidencias
    mensajeSinResultados.textContent =
        "No se encontraron administradores que coincidan con la búsqueda.";


    // Muestra los administradores filtrados
    mostrarAdministradoresRetorno(
        administradoresFiltrados
    );
}


// Función para ir a modificar un administrador
function modificarAdminRetorno(idAdministrador){

    // Guarda temporalmente el identificador seleccionado
    sessionStorage.setItem(
        "administradorModificarId",
        idAdministrador
    );

    // Redirige a la página de modificación
    window.location.href =
        "/pages/Administrador/modificarAdministrador.html";
}


// Función para confirmar la eliminación
function eliminarAdminRetorno(idAdministrador){

    Swal.fire({
        title: "¿Eliminar Administrador?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"

    }).then(async function(resultado){

        // Verifica si el usuario confirmó
        if(resultado.isConfirmed){

            try{

                // Solicita al service eliminar el administrador
                const datosRespuesta =
                    await eliminarAdministrador(
                        idAdministrador
                    );


                // Muestra mensaje de éxito
                Swal.fire({
                    title: "Administrador eliminado",
                    text: datosRespuesta.mensaje,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });


                // Vuelve a cargar los administradores
                cargarAdministradoresRetorno();

            } catch(error){

                console.error(
                    "Error al eliminar administrador:",
                    error
                );

                Swal.fire({
                    title: "Error",
                    text: "No fue posible eliminar el administrador.",
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
        cuerpoTablaAdministradores
            .querySelectorAll(
                ".boton-modificar"
            );

    // Obtiene todos los botones eliminar
    const botonesEliminar =
        cuerpoTablaAdministradores
            .querySelectorAll(
                ".boton-eliminar"
            );


    // Agrega el evento a los botones modificar
    botonesModificar.forEach(
        function(boton){

            boton.addEventListener(
                "click",
                function(){

                    modificarAdminRetorno(
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

                    eliminarAdminRetorno(
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
if(inputBuscarAdmin){

    inputBuscarAdmin.addEventListener(
        "input",
        aplicarFiltros
    );
}


// Ejecuta el filtro cuando cambia el rol
if(selectRol){

    selectRol.addEventListener(
        "change",
        aplicarFiltros
    );
}


// Carga los administradores cuando abre la página
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarAdministradoresRetorno();
    }
);