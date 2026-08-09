// Importa el modelo del responsable
import {
    crearResponsable
} from "../models/responsable.js";

// Importa las funciones necesarias del servicio
import {
    obtenerResponsablePorId,
    modificarResponsable
} from "../services/responsableService.js";


// Se obtienen los elementos del formulario
const formularioResponsable =
    document.getElementById("formularioResponsable");

const inputNombreCompleto =
    document.getElementById("nombreCompleto");

const inputTelefono =
    document.getElementById("telefono");

const inputInstitucion =
    document.getElementById("Institucion");

const inputArea =
    document.getElementById("Area");

const inputBiografia =
    document.getElementById("biografia");

const btnCancelar =
    document.getElementById("btnCancelar");


// Identificador del responsable seleccionado en el listado
const idResponsable =
    sessionStorage.getItem("responsableModificarId");


// Guarda la lista completa de teléfonos
// para no perder los teléfonos adicionales
let telefonosGuardados = [];


// Función para validar los campos obligatorios
function validarCamposVacios() {

    let error = false;

    // Agrupa los campos obligatorios
    const camposObligatorios = [
        inputNombreCompleto,
        inputTelefono,
        inputInstitucion,
        inputArea,
        inputBiografia
    ];

    // Recorre cada campo y verifica que tenga información
    camposObligatorios.forEach(function (campo) {

        if (campo.value.trim() === "") {

            campo.classList.add("input-error");
            error = true;

        } else {

            campo.classList.remove("input-error");
        }
    });

    return error;
}


// Función para validar el teléfono
function validarTelefono() {

    let error = false;

    const telefono =
        inputTelefono.value.trim();

    // Valida que contenga únicamente números
    // y exactamente 8 dígitos
    if (
        isNaN(telefono) ||
        telefono.length !== 8
    ) {

        inputTelefono.classList.add("input-error");
        error = true;

    } else {

        inputTelefono.classList.remove("input-error");
    }

    return error;
}


// Función para cargar los datos del responsable
async function cargarResponsableRetorno() {

    // Verifica que exista un responsable seleccionado
    if (idResponsable === null) {

        Swal.fire({
            title: "Responsable no seleccionado",
            text: "Debe seleccionar un responsable desde el listado.",
            icon: "warning",
            confirmButtonText: "Volver al listado"

        }).then(function () {

            window.location.href =
                "/pages/Responsables/listarResponsables.html";
        });

        return;
    }

    try {

        // Obtiene el responsable por medio del service
        const responsable =
            await obtenerResponsablePorId(
                idResponsable
            );

        // Guarda todos los teléfonos registrados
        telefonosGuardados =
            Array.isArray(responsable.telefonos)
                ? responsable.telefonos
                : [];

        // Carga el nombre en el formulario
        inputNombreCompleto.value =
            responsable.nombreCompleto || "";

        // Carga el primer teléfono
        inputTelefono.value =
            telefonosGuardados[0] || "";

        // Carga la institución
        inputInstitucion.value =
            responsable.institucion || "";

        // Carga el área
        inputArea.value =
            responsable.area || "";

        // Carga la biografía
        inputBiografia.value =
            responsable.biografia || "";

    } catch (error) {

        console.error(
            "Error al cargar responsable:",
            error
        );

        Swal.fire({
            title: "Error al cargar responsable",
            text: "No fue posible obtener la información del responsable.",
            icon: "error",
            confirmButtonText: "Volver al listado"

        }).then(function () {

            window.location.href =
                "/pages/Responsables/listarResponsables.html";
        });
    }
}


// Función principal para modificar el responsable
async function modificarResponsableRetorno() {

    // Ejecuta las validaciones
    const errorCamposVacios =
        validarCamposVacios();

    const errorTelefono =
        validarTelefono();

    // Verifica que no existan errores
    if (
        errorCamposVacios === false &&
        errorTelefono === false
    ) {

        // Crea una copia de los teléfonos existentes
        const telefonos =
            telefonosGuardados.slice();

        // Reemplaza el teléfono principal
        telefonos[0] =
            inputTelefono.value.trim();

        // Crea el objeto responsable utilizando el modelo
        const responsable =
            crearResponsable(
                inputNombreCompleto.value.trim(),
                "", // El correo no se modifica desde esta pantalla
                inputInstitucion.value.trim(),
                telefonos,
                inputArea.value.trim(),
                inputBiografia.value.trim()
            );

        try {

            // Envía los cambios por medio del service
            const datosRespuesta =
                await modificarResponsable(
                    idResponsable,
                    responsable
                );

            // Muestra mensaje de éxito
            Swal.fire({
                title: "Cambios guardados",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"

            }).then(function () {

                // Elimina el identificador temporal
                sessionStorage.removeItem(
                    "responsableModificarId"
                );

                // Regresa al listado
                window.location.href =
                    "/pages/Responsables/listarResponsables.html";
            });

        } catch (error) {

            console.error(
                "Error al modificar responsable:",
                error
            );

            Swal.fire({
                title: "No se pueden guardar los cambios",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }

    } else {

        Swal.fire({
            title: "No se pueden guardar los cambios",
            text: "Por favor revise los campos marcados en rojo.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para cancelar la modificación
function cancelarModificacionRetorno() {

    // Elimina el identificador temporal
    sessionStorage.removeItem(
        "responsableModificarId"
    );

    // Regresa al listado
    window.location.href =
        "/pages/Responsables/listarResponsables.html";
}


// Evento que se ejecuta al enviar el formulario
if (formularioResponsable) {

    formularioResponsable.addEventListener(
        "submit",
        function (evento) {

            // Evita que el formulario se envíe automáticamente
            evento.preventDefault();

            // Ejecuta la modificación
            modificarResponsableRetorno();
        }
    );
}


// Evento que se ejecuta al presionar Cancelar
if (btnCancelar) {

    btnCancelar.addEventListener(
        "click",
        cancelarModificacionRetorno
    );
}


// Carga los datos cuando abre la pantalla
document.addEventListener(
    "DOMContentLoaded",
    function () {

        cargarResponsableRetorno();
    }
);