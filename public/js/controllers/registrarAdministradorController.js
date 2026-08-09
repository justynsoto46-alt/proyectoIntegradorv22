// Importa el modelo del administrador
import {
    crearAdministrador
} from "../models/administrador.js";

// Importa el servicio para registrar administradores
import {
    registrarAdministrador
} from "../services/administradorService.js";


// Se obtienen los elementos del formulario
const formulario =
    document.getElementById("formulario");

const nombre =
    document.getElementById("nombre");

const correo =
    document.getElementById("correo");

const contrasena =
    document.getElementById("contrasena");

const rol =
    document.getElementById("rol");


// Función para validar los campos obligatorios
function validarCamposVacios(){

    let error = false;

    // Valida el nombre
    if(nombre.value.trim() === ""){

        nombre.classList.add("input-error");
        error = true;

    } else{

        nombre.classList.remove("input-error");
    }

    // Valida el correo
    if(correo.value.trim() === ""){

        correo.classList.add("input-error");
        error = true;

    } else{

        correo.classList.remove("input-error");
    }

    // Valida la contraseña
    if(contrasena.value.trim() === ""){

        contrasena.classList.add("input-error");
        error = true;

    } else{

        contrasena.classList.remove("input-error");
    }

    return error;
}


// Función para validar el formato del correo electrónico
function validarCorreo(){

    let error = false;

    const valorCorreo =
        correo.value.trim();

    // Verifica que contenga @ y .
    if(
        valorCorreo.includes("@") &&
        valorCorreo.includes(".")
    ){

        correo.classList.remove("input-error");

    } else{

        correo.classList.add("input-error");
        error = true;
    }

    return error;
}


// Función para validar la contraseña
function validarContrasenia(){

    let error = false;

    const valorContrasena =
        contrasena.value.trim();

    // Debe tener mínimo 8 caracteres
    if(valorContrasena.length < 8){
        error = true;
    }

    // Debe tener máximo 16 caracteres
    if(valorContrasena.length > 16){
        error = true;
    }

    // Debe contener al menos una mayúscula
    if(!/[A-Z]/.test(valorContrasena)){
        error = true;
    }

    // Debe contener al menos una minúscula
    if(!/[a-z]/.test(valorContrasena)){
        error = true;
    }

    // Debe contener al menos un número
    if(!/[0-9]/.test(valorContrasena)){
        error = true;
    }

    // Debe contener al menos un carácter especial
    if(!/[!@#$%^&*(),.?":{}|<>]/.test(valorContrasena)){
        error = true;
    }

    // No debe contener vocales
    if(/[aeiouAEIOU]/.test(valorContrasena)){
        error = true;
    }

    if(error){

        contrasena.classList.add("input-error");

    } else{

        contrasena.classList.remove("input-error");
    }

    return error;
}


// Función principal para registrar un administrador
async function registrarAdministradorRetorno(){

    // Ejecuta las validaciones
    const errorVacios =
        validarCamposVacios();

    const errorFormatoCorreo =
        validarCorreo();

    const errorFormatoContrasena =
        validarContrasenia();

    // Verifica que no existan errores
    if(
        errorVacios === false &&
        errorFormatoCorreo === false &&
        errorFormatoContrasena === false
    ){

        // Crea el objeto administrador utilizando el modelo
        const administrador =
            crearAdministrador(
                nombre.value.trim(),
                correo.value.trim(),
                contrasena.value.trim(),
                rol.value
            );

        try{

            // Envía el administrador por medio del service
            const datosRespuesta =
                await registrarAdministrador(
                    administrador
                );

            // Muestra el mensaje de éxito
            Swal.fire({
                title: "Registro exitoso",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"

            }).then(function(){

                // Limpia el formulario
                limpiarFormulario();

                // Redirige al listado
                window.location.href =
                    "/pages/Administrador/listarAdmin.html";
            });

        } catch(error){

            console.error(
                "Error al registrar administrador:",
                error
            );

            Swal.fire({
                title: "No se pudo completar la operación",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }

    } else{

        Swal.fire({
            title: "No se puede realizar el registro",
            text: "Por favor revise los campos marcados",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para limpiar el formulario
function limpiarFormulario(){

    // Limpia los campos
    nombre.value = "";
    correo.value = "";
    contrasena.value = "";

    // Elimina los estilos de error
    nombre.classList.remove("input-error");
    correo.classList.remove("input-error");
    contrasena.classList.remove("input-error");
}


// Evento que se ejecuta al enviar el formulario
if(formulario){

    formulario.addEventListener(
        "submit",
        function(evento){

            // Evita que el formulario se envíe automáticamente
            evento.preventDefault();

            // Ejecuta el registro
            registrarAdministradorRetorno();
        }
    );
}