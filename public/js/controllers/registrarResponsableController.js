// Importa el modelo del responsable
import {
    crearResponsable
} from "../models/responsable.js";

// Importa el servicio para registrar responsables
import {
    registrarResponsable
} from "../services/responsableService.js";

const formularioResponsable = document.getElementById("formularioResponsable");
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputInstitucion = document.getElementById("institucion");
const inputArea = document.getElementById("area");
const inputBiografia = document.getElementById("biografia");
const inputFechaRegistro = document.getElementById("fechaRegistro");

const btnAgregarTelefono = document.getElementById("btnAgregarTelefono");
const contenedorTelefonos = document.getElementById("contenedor-telefonos");


function validarCamposVacios() {
    let error = false;
    // Agrupamos los campos fijos en un arreglo para validarlos más rápido
    const campos = [inputNombre, inputCorreo, inputInstitucion,  inputArea, inputBiografia];

    campos.forEach(function (campo) {
        if (campo.value.trim() === "") {
            campo.classList.add("input-error");
            error = true;
        } else {
            campo.classList.remove("input-error");
        }
    });

    return error;
}

function validarTelefonos() {
    let error = false;
    // Seleccionamos TODOS los inputs de teléfono (los originales y los creados dinámicamente)
    const inputsTelefonos = document.querySelectorAll("input[type='tel']");

    inputsTelefonos.forEach(function (inputTel) {
        if (inputTel.value.trim() === "") {
            inputTel.classList.add("input-error");
            error = true;
        } else {
            inputTel.classList.remove("input-error");
        }
    });

    return error;
}

function validarCorreo() {
    let error = false;
    const correo = inputCorreo.value.trim();

    if (correo.includes("@") && correo.includes(".")) {
        inputCorreo.classList.remove("input-error");
    } else {
        inputCorreo.classList.add("input-error");
        error = true;
    }
    return error;
}


// Devuelve todos los teléfonos escritos en el formulario
function obtenerTelefonos() {

    const inputsTelefonos = document.querySelectorAll("input[type='tel']");

    const telefonos = [];

    inputsTelefonos.forEach(function (inputTel) {

        const valor = inputTel.value.trim();

        if (valor !== "") {
            telefonos.push(valor);
        }
    });

    return telefonos;
}


document.addEventListener('DOMContentLoaded', () => {

    // Obtenemos la fecha actual y la mostramos en el campo de solo lectura
    const fechaHoy = new Date();

    const fechaFormateada = fechaHoy.toISOString().split('T')[0];

    inputFechaRegistro.value = fechaFormateada;
});


// Función principal para registrar el responsable en MongoDB
async function registrarResponsableRetorno() {

    // Ejecutamos todas las validaciones y guardamos sus resultados
    let errorVacios = validarCamposVacios();
    let errorTelefonos = validarTelefonos();
    let errorCorreo = validarCorreo();

    // Si ALGUNA de las validaciones devuelve 'true' (hay error), detenemos el proceso
    if (errorVacios || errorTelefonos || errorCorreo) {

        Swal.fire({
            title: "Datos incompletos o inválidos",
            text: "Por favor revise los campos marcados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        return;
    }

    // Crea el objeto responsable utilizando el modelo
    const responsable = crearResponsable(
        inputNombre.value.trim(),
        inputCorreo.value.trim(),
        inputInstitucion.value.trim(),
        obtenerTelefonos(),
        inputArea.value.trim(),
        inputBiografia.value.trim()
    );

    try {

        // Envía el responsable por medio del service
        const datosRespuesta =
            await registrarResponsable(
                responsable
            );

        Swal.fire({
            title: "¡Responsable Creado!",
            text: datosRespuesta.mensaje,
            icon: "success",
            confirmButtonText: "Ir a la lista"

        }).then(function () {

            window.location.href =
                "/pages/Responsables/listarResponsables.html";
        });

    } catch (error) {

        console.error("Error al registrar responsable:", error);

        avisarError("No se pudo completar la operación", error.message);
    }
}

// Escuchamos el evento de enviar del formulario
formularioResponsable.addEventListener("submit", function (evento) {
    evento.preventDefault();
    registrarResponsableRetorno();
});

btnAgregarTelefono.addEventListener("click", function () {
    // a. Creamos la nueva etiqueta <label>
    const nuevoLabel = document.createElement("label");
    nuevoLabel.textContent = "Teléfono Adicional ";

    // b. Creamos el nuevo campo <input>
    const nuevoInput = document.createElement("input");
    nuevoInput.type = "tel";
    nuevoInput.name = "telefono[]";
    nuevoInput.placeholder = "88888888";

    // c. Metemos el <input> dentro del <label> (para mantener el estilo CSS actual)
    nuevoLabel.appendChild(nuevoInput);

    // d. Insertamos el <label> completo dentro de nuestro contenedor de teléfonos
    contenedorTelefonos.appendChild(nuevoLabel);
});
