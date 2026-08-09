// Importa el servicio para modificar la contraseña
import {
    modificarContrasena
} from "../services/contrasenaService.js";


// Obtiene los elementos del formulario
const formulario =
    document.getElementById("formulario");

const inputCorreo =
    document.getElementById("correo");

const inputNuevaContrasenia =
    document.getElementById("nuevaContrasenia");

const inputConfirmarContrasenia =
    document.getElementById("confirmarContrasenia");


// Función para validar campos vacíos
function validarCamposVacios(){

    const correo =
        inputCorreo.value.trim();

    const nuevaContrasenia =
        inputNuevaContrasenia.value.trim();

    const confirmarContrasenia =
        inputConfirmarContrasenia.value.trim();

    let error = false;


    // Valida el correo
    if(correo === ""){

        inputCorreo.classList.add("input-error");
        error = true;

    } else{

        inputCorreo.classList.remove("input-error");
    }


    // Valida la nueva contraseña
    if(nuevaContrasenia === ""){

        inputNuevaContrasenia.classList.add(
            "input-error"
        );

        error = true;

    } else{

        inputNuevaContrasenia.classList.remove(
            "input-error"
        );
    }


    // Valida la confirmación
    if(confirmarContrasenia === ""){

        inputConfirmarContrasenia.classList.add(
            "input-error"
        );

        error = true;

    } else{

        inputConfirmarContrasenia.classList.remove(
            "input-error"
        );
    }


    return error;
}


// Función para validar el formato del correo
function validarCorreo(){

    let error = false;

    const correo =
        inputCorreo.value.trim();

    // Valida que tenga @ y .
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


// Función para validar la nueva contraseña
function validarContrasenia(){

    let error = false;

    const contrasenia =
        inputNuevaContrasenia.value.trim();


    // Mínimo 8 caracteres
    if(contrasenia.length < 8){
        error = true;
    }

    // Máximo 16 caracteres
    if(contrasenia.length > 16){
        error = true;
    }

    // Debe contener una mayúscula
    if(!/[A-Z]/.test(contrasenia)){
        error = true;
    }

    // Debe contener una minúscula
    if(!/[a-z]/.test(contrasenia)){
        error = true;
    }

    // Debe contener un número
    if(!/[0-9]/.test(contrasenia)){
        error = true;
    }

    // Debe contener un carácter especial
    if(!/[!@#$%^&*(),.?":{}|<>]/.test(contrasenia)){
        error = true;
    }

    // No debe contener vocales
    if(/[aeiouAEIOU]/.test(contrasenia)){
        error = true;
    }


    if(error){

        inputNuevaContrasenia.classList.add(
            "input-error"
        );

    } else{

        inputNuevaContrasenia.classList.remove(
            "input-error"
        );
    }


    return error;
}


// Función para confirmar que ambas contraseñas sean iguales
function validarConfirmacionContrasenia(){

    let error = false;

    const contrasenia =
        inputNuevaContrasenia.value.trim();

    const confirmarContrasenia =
        inputConfirmarContrasenia.value.trim();


    if(contrasenia === confirmarContrasenia){

        inputConfirmarContrasenia.classList.remove(
            "input-error"
        );

    } else{

        inputConfirmarContrasenia.classList.add(
            "input-error"
        );

        error = true;
    }


    return error;
}


// Función para limpiar el formulario
function limpiarFormulario(){

    inputCorreo.value = "";
    inputNuevaContrasenia.value = "";
    inputConfirmarContrasenia.value = "";

    inputCorreo.classList.remove("input-error");

    inputNuevaContrasenia.classList.remove(
        "input-error"
    );

    inputConfirmarContrasenia.classList.remove(
        "input-error"
    );
}


// Función principal para modificar la contraseña
async function modificarContraseniaRetorno(){

    const errorCamposVacios =
        validarCamposVacios();

    const errorCorreo =
        validarCorreo();

    const errorContrasenia =
        validarContrasenia();

    const errorConfirmacion =
        validarConfirmacionContrasenia();


    // Verifica que todas las validaciones sean correctas
    if(
        errorCamposVacios === false &&
        errorCorreo === false &&
        errorContrasenia === false &&
        errorConfirmacion === false
    ){

        try{

            // Envía la nueva contraseña por medio del service
            const datosRespuesta =
                await modificarContrasena(
                    inputCorreo.value.trim(),
                    inputNuevaContrasenia.value.trim()
                );


            Swal.fire({
                title: "Cambio de contraseña exitoso",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"

            }).then(function(){

                limpiarFormulario();

                // Finaliza cualquier sesión anterior
                sessionStorage.clear();

                // Redirige al inicio de sesión
                window.location.href =
                    "/pages/DashBoard/iniciarSesion.html";
            });

        } catch(error){

            console.error(
                "Error al modificar contraseña:",
                error
            );

            Swal.fire({
                title: "No se pudo modificar la contraseña",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }

    } else{

        Swal.fire({
            title: "No se puede restablecer su contraseña",
            text: "Por favor revise los campos marcados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}


// Evento que se ejecuta al enviar el formulario
if(formulario){

    formulario.addEventListener(
        "submit",
        function(evento){

            // Evita que la página se recargue
            evento.preventDefault();

            // Ejecuta la modificación
            modificarContraseniaRetorno();
        }
    );
}