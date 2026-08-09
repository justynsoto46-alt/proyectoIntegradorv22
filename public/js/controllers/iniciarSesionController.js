// Importa el servicio de autenticación
import {
    iniciarSesion
} from "../services/autenticacionService.js";

// Para obtener los elementos del formulario de inicio de sesión
const formulario = document.getElementById("formulario");
const inputCorreo = document.getElementById("correo");
const inputContrasenia = document.getElementById("contrasenia");

// Funciones

// Validar campos
function validarCamposVacios(){

    let error = false;

    // Si usuario está vacío
    if(inputCorreo.value.trim() === ""){
        inputCorreo.classList.add("input-error");

        Swal.fire({
            title: "Campo vacío",
            text: "Ingrese un correo electrónico para poder continuar.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        error = true;
    } else {
        inputCorreo.classList.remove("input-error");
    }

    // Si contrasenia está vacía
    if(inputContrasenia.value.trim() === ""){
        inputContrasenia.classList.add("input-error");

        Swal.fire({
            title: "Campo vacío",
            text: "Ingrese una contraseña para poder continuar.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    
        error = true;
    } else {
        inputContrasenia.classList.remove("input-error");
    }

    return error;
}

// Validar si correo cumple con el formato
function validarCorreo(){

    let error = false;
    const correo = inputCorreo.value.trim();

    // El correo no debe estar vacío
    if(correo === ""){
        error = true;
    }

    // El correo no debe contener espacios
    if(correo.includes(" ")){
        error = true;
    }

    // El correo debe contener @ y .
    if(!correo.includes("@") || !correo.includes(".")){
        error = true;
    }

    if(error){

        inputCorreo.classList.add("input-error");

        Swal.fire({
            title: "Correo inválido",
            text: "Ingrese un correo electrónico válido y sin espacios.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

    } else{

        inputCorreo.classList.remove("input-error");
    }
    return error;
}

// Validar contrasenia
function validarContrasenia(){
    
    let error = false;
    const contrasenia = inputContrasenia.value.trim();

    // Mínimo 8 caracteres
    if(contrasenia.length < 8){
        error = true;
    }

    // Máximo 16 caracteres
    if(contrasenia.length > 16){
        error = true;
    }

    // Debe contener al menos una mayúscula
    if(!/[A-Z]/.test(contrasenia)){
        error = true;
    }

    // Debe contener al menos una minúscula
    if(!/[a-z]/.test(contrasenia)){
        error = true;
    }

    // Debe contener al menos un número
    if(!/[0-9]/.test(contrasenia)){
        error = true;
    }

    // Debe contener al menos un carácter especial
    if(!/[!@#$%^&*(),.?":{}|<>]/.test(contrasenia)){
        error = true;
    }

    // No debe contener vocales
    if(/[aeiouAEIOU]/.test(contrasenia)){
        error = true;
    }

    if(error){
        inputContrasenia.classList.add("input-error");

        Swal.fire({
        title: "Contraseña inválida",
        text: "La contraseña debe cumplir con los requisitos de seguridad establecidos.",
        icon: "warning",
        confirmButtonText: "Aceptar"
        });

    } else {
        inputContrasenia.classList.remove("input-error");
    }
    return error;
}


// Limpiar el formulario
function limpiarFormulario(){
    inputCorreo.value = "";
    inputContrasenia.value = "";

    inputCorreo.classList.remove("input-error");
    inputContrasenia.classList.remove("input-error");
}

// Función principal para iniciar sesión
async function iniciarSesionRetorno(){

    if(
        validarCamposVacios() === false &&
        validarCorreo() === false &&
        validarContrasenia() === false
    ){

        try{

            // Envía las credenciales por medio del service
            const datosRespuesta =
                await iniciarSesion(
                    inputCorreo.value.trim(),
                    inputContrasenia.value.trim()
                );

            // Guarda la sesión activa
            sessionStorage.setItem(
                "sesionActiva",
                "true"
            );

            // Guarda algunos datos del administrador
            // para poder utilizarlos durante la sesión
            if(datosRespuesta.administrador){

                sessionStorage.setItem(
                    "administradorId",
                    datosRespuesta.administrador._id
                );

                sessionStorage.setItem(
                    "administradorNombre",
                    datosRespuesta.administrador.nombreCompleto
                );

                sessionStorage.setItem(
                    "administradorCorreo",
                    datosRespuesta.administrador.correo
                );
            }

            // Limpia el formulario
            limpiarFormulario();

            // Redirige al menú principal
            window.location.replace(
                "/pages/DashBoard/menuPrincipal.html"
            );

        } catch(error){

            console.error(
                "Error al iniciar sesión:",
                error
            );

            Swal.fire({
                title: "Credenciales incorrectas",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });

            limpiarFormulario();
        }
    }
}

// Evento Final
formulario.addEventListener("submit", function(evento) { // Escucha cuando se envia el form, "submit": Cuando presiona enter o el botón
    evento.preventDefault(); // Evita que se recargue la página
    iniciarSesionRetorno(); // Ejecuta la función principal
});