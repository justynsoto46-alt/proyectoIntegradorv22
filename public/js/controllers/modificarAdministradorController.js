// Importa el modelo del administrador
import {
    crearAdministrador
} from "../models/administrador.js";

// Importa las funciones necesarias del servicio
import {
    obtenerAdministradorPorId,
    modificarAdministrador
} from "../services/administradorService.js";


// Se obtienen los elementos del formulario de modificación
const formularioAdministrador =
    document.getElementById("formularioAdministrador");

const inputNombreCompleto =
    document.getElementById("nombreCompleto");

const inputCorreo =
    document.getElementById("correo");

const inputRol =
    document.getElementById("rol");

const btnCancelar =
    document.getElementById("btnCancelar");


// Obtiene el identificador del administrador
// seleccionado anteriormente desde el listado
const idAdministrador =
    sessionStorage.getItem("administradorModificarId");


// Función para validar los campos obligatorios
function validarCamposVacios(){

    let error = false;

    // Valida el nombre completo
    if(inputNombreCompleto.value.trim() === ""){

        inputNombreCompleto.classList.add("input-error");
        error = true;

    } else{

        inputNombreCompleto.classList.remove("input-error");
    }

    // Valida el correo electrónico
    if(inputCorreo.value.trim() === ""){

        inputCorreo.classList.add("input-error");
        error = true;

    } else{

        inputCorreo.classList.remove("input-error");
    }

    return error;
}


// Función para validar el formato del correo electrónico
function validarCorreo(){

    let error = false;

    const correo =
        inputCorreo.value.trim();

    // Verifica que el correo contenga @ y .
    if(
        correo.includes("@") &&
        correo.includes(".")
    ){

        inputCorreo.classList.remove("input-error");

    } else{

        inputCorreo.classList.add("input-error");
        error = true;
    }

    return error;
}


// Función para cargar los datos del administrador
async function cargarAdministradorRetorno(){

    // Verifica que exista un administrador seleccionado
    if(idAdministrador === null){

        Swal.fire({
            title: "Administrador no seleccionado",
            text: "Debe seleccionar un administrador desde el listado.",
            icon: "warning",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Administrador/listarAdmin.html";
        });

        return;
    }

    try{

        // Obtiene el administrador por medio del service
        const administrador =
            await obtenerAdministradorPorId(
                idAdministrador
            );

        // Carga el nombre completo en el formulario
        inputNombreCompleto.value =
            administrador.nombreCompleto || "";

        // Carga el correo electrónico
        inputCorreo.value =
            administrador.correo || "";

        // Carga el rol
        inputRol.value =
            administrador.rol || "";

    } catch(error){

        console.error(
            "Error al cargar administrador:",
            error
        );

        Swal.fire({
            title: "Error al cargar administrador",
            text: "No fue posible obtener la información del administrador.",
            icon: "error",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Administrador/listarAdmin.html";
        });
    }
}


// Función principal para modificar el administrador
async function modificarAdministradorRetorno(){

    // Ejecuta las validaciones
    const errorCamposVacios =
        validarCamposVacios();

    const errorCorreo =
        validarCorreo();

    // Verifica que no existan errores
    if(
        errorCamposVacios === false &&
        errorCorreo === false
    ){

        // Crea el objeto administrador utilizando el modelo
        // La contraseña se envía vacía porque no se modifica
        // desde esta pantalla
        const administrador =
            crearAdministrador(
                inputNombreCompleto.value.trim(),
                inputCorreo.value.trim(),
                "",
                inputRol.value
            );

        try{

            // Envía los cambios por medio del service
            const datosRespuesta =
                await modificarAdministrador(
                    idAdministrador,
                    administrador
                );

            // Muestra el mensaje de éxito
            Swal.fire({
                title: "Cambios guardados",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"

            }).then(function(){

                // Elimina el identificador temporal
                sessionStorage.removeItem(
                    "administradorModificarId"
                );

                // Regresa al listado
                window.location.href =
                    "/pages/Administrador/listarAdmin.html";
            });

        } catch(error){

            console.error(
                "Error al modificar administrador:",
                error
            );

            Swal.fire({
                title: "No se pueden guardar los cambios",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }

    } else{

        Swal.fire({
            title: "No se pueden guardar los cambios",
            text: "Por favor revise los campos marcados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para cancelar la modificación
function cancelarModificacionRetorno(){

    // Elimina el identificador temporal
    sessionStorage.removeItem(
        "administradorModificarId"
    );

    // Regresa al listado
    window.location.href =
        "/pages/Administrador/listarAdmin.html";
}


// Evento que se ejecuta al enviar el formulario
if(formularioAdministrador){

    formularioAdministrador.addEventListener(
        "submit",
        function(evento){

            // Evita que el formulario se envíe automáticamente
            evento.preventDefault();

            // Ejecuta la modificación
            modificarAdministradorRetorno();
        }
    );
}


// Evento que se ejecuta al presionar Cancelar
if(btnCancelar){

    btnCancelar.addEventListener(
        "click",
        cancelarModificacionRetorno
    );
}


// Carga los datos cuando se abre la pantalla
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarAdministradorRetorno();
    }
);