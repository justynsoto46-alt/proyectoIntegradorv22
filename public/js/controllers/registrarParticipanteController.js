// Importa el modelo del participante
import {
    crearParticipante
} from "../models/participante.js";

// Importa el servicio para registrar participantes
import {
    registrarParticipante
} from "../services/participanteService.js";

// Se obtienen los elementos del formulario de registro de participante
const formulario = document.getElementById("formulario");
const inputNombreCompleto = document.getElementById("nombreCompleto");
const inputIdentificacion = document.getElementById("identificacion");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");
const inputEdad = document.getElementById("edad");
const inputProfesion = document.getElementById("profesion");

// Función para validar los campos obligatorios
function validarCamposVacios() {

    let error = false;

    // Nombre completo
    if (inputNombreCompleto.value.trim() === "") {
        inputNombreCompleto.classList.add("input-error");

        Swal.fire({
            title: "Nombre incompleto",
            text: "Ingrese un nombre válido para poder continuar.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        error = true;
    } else {
        inputNombreCompleto.classList.remove("input-error");
    }

    // Identificación
    if (inputIdentificacion.value.trim() === "") {
        inputIdentificacion.classList.add("input-error");

        Swal.fire({
            title: "Identificación incompleta",
            text: "Ingrese una identificación válida para poder continuar.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        error = true;
    } else {
        inputIdentificacion.classList.remove("input-error");
    }

    // Correo electrónico
    if (inputCorreo.value.trim() === "") {
        inputCorreo.classList.add("input-error");

        Swal.fire({
            title: "Correo electrónico incompleto",
            text: "Ingrese un correo electrónico válido para poder continuar.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        error = true;
    } else {
        inputCorreo.classList.remove("input-error");
    }

    // Teléfono
    if (inputTelefono.value.trim() === "") {
        inputTelefono.classList.add("input-error");

        Swal.fire({
            title: "Teléfono incompleto",
            text: "Ingrese un número telefónico válido para poder continuar.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        error = true;
    } else {
        inputTelefono.classList.remove("input-error");
    }

    return error;
}

// Función para validar el nombre completo
function validarNombreCompleto() {

    let error = false;
    const nombreCompleto = inputNombreCompleto.value.trim();

    // Valida que el nombre no esté vacío
    if (nombreCompleto === "") {
        error = true;
    }

    // Valida que tenga mínimo 3 caracteres
    if (nombreCompleto.length < 3) {
        error = true;
    }

    // Valida que no contenga números
    if (/\d/.test(nombreCompleto)) {
        error = true;
    }

    if (error) {
        inputNombreCompleto.classList.add("input-error");

        Swal.fire({
            title: "Nombre inválido",
            text: "Ingrese un nombre válido. Mínimo 3 caracteres, no se permiten números.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

    } else {
        inputNombreCompleto.classList.remove("input-error");
    }

    return error;
}

// Función para validar la identificación
function validarIdentificacion() {

    let error = false;
    const identificacion = inputIdentificacion.value.trim();

    // Valida que la identificación no esté vacía
    if (identificacion === "") {
        error = true;
    }

    // Valida que contenga únicamente números
    if (isNaN(identificacion)) {
        error = true;
    }

    // Valida que tenga mínimo 9 dígitos
    if (identificacion.length < 9) {
        error = true;
    }

    // Valida que no tenga más de 15 dígitos
    if (identificacion.length > 15) {
        error = true;
    }

    if (error) {
        inputIdentificacion.classList.add("input-error");

        Swal.fire({
            title: "Identificación inválida",
            text: "Ingrese una identificación válida. Debe contener solo números y tener entre 9 y 15 dígitos.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

    } else {
        inputIdentificacion.classList.remove("input-error");
    }

    return error;
}

// Función para validar el formato del correo electrónico
function validarCorreo() {

    let error = false;
    const correo = inputCorreo.value.trim();

    // El correo no debe contener espacios
    if (correo.includes(" ")) {
        error = true;
    }

    // Debe contener @ y .
    if (!correo.includes("@") || !correo.includes(".")) {
        error = true;
    }

    if (error) {
        inputCorreo.classList.add("input-error");

        Swal.fire({
            title: "Correo electrónico inválido",
            text: "Ingrese un correo electrónico válido. No se permiten espacios.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

    } else {
        inputCorreo.classList.remove("input-error");
    }

    return error;
}

// Función para validar el teléfono
function validarTelefono() {

    let error = false;
    const telefono = inputTelefono.value.trim();

    // Debe contener únicamente números
    if (isNaN(telefono)) {
        error = true;
    }

    // Debe contener exactamente 8 dígitos
    if (telefono.length !== 8) {
        error = true;
    }

    if (error) {

        inputTelefono.classList.add("input-error");

        Swal.fire({
            title: "Teléfono inválido",
            text: "Ingrese un número de teléfono válido. Debe contener únicamente números y exactamente 8 dígitos.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

    } else {
        inputTelefono.classList.remove("input-error");
    }
    return error;
}

// Función para validar la edad del participante
function validarEdad() {

    let error = false;
    const edad = inputEdad.value.trim();

    // La edad es opcional, pero si se ingresa debe ser válida
    if (edad !== "") {

        if (isNaN(edad) || Number(edad) < 16 || Number(edad) > 120) {

            inputEdad.classList.add("input-error");
            error = true;

            Swal.fire({
                title: "Edad inválida",
                text: "La edad debe ser un número entre 16 y 120 años.",
                icon: "warning",
                confirmButtonText: "Aceptar"
            });

        } else {
            inputEdad.classList.remove("input-error");
        }
    } else {
        inputEdad.classList.remove("input-error");
    }

    return error;
}

// Función para validar la profesión
function validarProfesion() {

    let error = false;
    const profesion = inputProfesion.value.trim();

    // La profesión es opcional, pero si se ingresa debe ser válida
    if (profesion !== "") {

        // Valida que tenga mínimo 3 caracteres
        if (profesion.length < 3) {
            error = true;
        }

        // Valida que no sea solo numérica
        if (!isNaN(profesion)) {
            error = true;
        }

        if (error) {

            inputProfesion.classList.add("input-error");

            Swal.fire({
                title: "Profesión inválida",
                text: "Ingrese una profesión válida. Debe tener mínimo 3 caracteres y no puede ser solo numérica.",
                icon: "warning",
                confirmButtonText: "Aceptar"
            });
        } else {
            inputProfesion.classList.remove("input-error");
        }
    } else {
        inputProfesion.classList.remove("input-error");
    }

    return error;
}

// Función principal para registrar un participante
async function registrarParticipanteRetorno() {

    if (validarCamposVacios() === false &&
        validarNombreCompleto() === false &&
        validarIdentificacion() === false &&
        validarCorreo() === false &&
        validarTelefono() === false &&
        validarEdad() === false &&
        validarProfesion() === false) {

        // Crea el objeto participante utilizando el modelo
        const participante = crearParticipante(
            inputNombreCompleto.value.trim(),
            inputIdentificacion.value.trim(),
            inputCorreo.value.trim(),
            inputTelefono.value.trim(),
            inputEdad.value.trim(),
            inputProfesion.value.trim()
        );

        try {

            // Envía el participante al service
            const datosRespuesta =
                await registrarParticipante(participante);

            // Guarda temporalmente el identificador del participante
            // para poder relacionarlo con sus inscripciones
            sessionStorage.setItem(
                "participanteId",
                datosRespuesta.idParticipante
            );

            // Muestra el mensaje de éxito
            Swal.fire({
                title: "Datos registrados correctamente",
                text: "Ahora seleccione las actividades a las que desea inscribirse.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(function () {

                // Limpia el formulario
                limpiarFormulario();

                // Redirige a la selección de actividades
                window.location.href =
                    "/pages/Actividad/seleccionarActividades.html";
            });

        } catch (error) {

            console.error(
                "Error al registrar participante:",
                error
            );

            Swal.fire({
                title: "No se pudo realizar el registro",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {

    // Limpia los campos de texto
    inputNombreCompleto.value = "";
    inputIdentificacion.value = "";
    inputCorreo.value = "";
    inputTelefono.value = "";
    inputEdad.value = "";
    inputProfesion.value = "";


    // Elimina el estilo de error de los campos
    inputNombreCompleto.classList.remove("input-error");
    inputIdentificacion.classList.remove("input-error");
    inputCorreo.classList.remove("input-error");
    inputTelefono.classList.remove("input-error");
    inputEdad.classList.remove("input-error");
    inputProfesion.classList.remove("input-error");
}

// Evento que se ejecuta cuando el usuario intenta registrar el participante
formulario.addEventListener("submit", function (evento) {

    // Evita que el formulario se envíe automáticamente
    evento.preventDefault();

    // Ejecuta la función principal
    registrarParticipanteRetorno();

});