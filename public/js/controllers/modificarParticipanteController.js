// Importa el modelo del participante
import {
    crearParticipante
} from "../models/participante.js";

// Importa las funciones necesarias del servicio
import {
    obtenerParticipantePorId,
    modificarParticipante
} from "../services/participanteService.js";

// Se obtienen los elementos del formulario de modificación de participante
const formularioParticipante = document.getElementById("formularioParticipante");

const inputNombreCompleto = document.getElementById("nombreCompleto");
const inputIdentificacion = document.getElementById("identificacion");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");
const inputEdad = document.getElementById("edad");
const inputProfesion = document.getElementById("profesion");

const btnCancelar = document.getElementById("btnCancelar");

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

// Obtiene el identificador del participante seleccionado
const idParticipante =
    sessionStorage.getItem("participanteModificarId");


// Función para cargar los datos del participante
async function cargarParticipanteRetorno() {

    // Verifica que exista un participante seleccionado
    if (idParticipante === null) {

        Swal.fire({
            title: "Participante no seleccionado",
            text: "Debe seleccionar un participante desde el listado.",
            icon: "warning",
            confirmButtonText: "Volver al listado"
        }).then(function () {

            window.location.href =
                "/pages/Participantes/listarParticipantes.html";
        });

        return;
    }

    try {

        const participante =
            await obtenerParticipantePorId(
                idParticipante
            );

        // Coloca los datos recibidos en el formulario
        inputNombreCompleto.value =
            participante.nombreCompleto || "";

        inputIdentificacion.value =
            participante.identificacion || "";

        inputCorreo.value =
            participante.correoElectronico || "";

        inputTelefono.value =
            participante.telefono || "";

        inputEdad.value =
            participante.edad === null
                ? ""
                : participante.edad;

        inputProfesion.value =
            participante.profesion || "";

    } catch (error) {

        console.error(
            "Error al cargar participante:",
            error
        );

        Swal.fire({
            title: "Error al cargar participante",
            text: "No fue posible obtener la información del participante.",
            icon: "error",
            confirmButtonText: "Volver al listado"
        }).then(function () {

            window.location.href =
                "/pages/Participantes/listarParticipantes.html";
        });
    }
}


// Función principal para modificar el participante
async function modificarParticipanteRetorno() {

    if (validarCamposVacios() === false &&
        validarNombreCompleto() === false &&
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
            inputProfesion.value.trim(),
            idParticipante
        );

        try {

            // Solicita al service modificar el participante
            const datosRespuesta =
                await modificarParticipante(
                    idParticipante,
                    participante
                );

            Swal.fire({
                title: "Cambios guardados",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(function () {

                sessionStorage.removeItem(
                    "participanteModificarId"
                );

                window.location.href =
                    "/pages/Participantes/listarParticipantes.html";
            });

        } catch (error) {

            console.error(
                "Error al modificar participante:",
                error
            );

            Swal.fire({
                title: "No se pudieron guardar los cambios",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    }
}

    // Función para cancelar la modificación
    function cancelarModificacionRetorno() {

        // Elimina el identificador temporal
        sessionStorage.removeItem(
            "participanteModificarId"
        );

        // Regresa al listado
        window.location.href =
            "/pages/Participantes/listarParticipantes.html";
    }

    // Evento que se ejecuta al enviar el formulario
    formularioParticipante.addEventListener(
        "submit",
        function (evento) {

            // Evita que el formulario se envíe automáticamente
            evento.preventDefault();

            // Ejecuta la modificación
            modificarParticipanteRetorno();
        }
    );

    // Evento que se ejecuta al presionar cancelar
    btnCancelar.addEventListener(
        "click",
        cancelarModificacionRetorno
    );

    // Carga los datos al abrir la pantalla
    document.addEventListener(
        "DOMContentLoaded",
        function () {

            cargarParticipanteRetorno();
        }
    );