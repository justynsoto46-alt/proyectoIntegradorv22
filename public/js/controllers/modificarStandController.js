// Importa el modelo del stand
import {
    crearStand
} from "../models/stand.js";

// Importa las funciones necesarias del servicio
import {
    obtenerStandPorId,
    modificarStand
} from "../services/standService.js";


// Se obtienen los elementos del formulario
const formularioStand =
    document.getElementById("formularioStand");

const inputEvento =
    document.getElementById("evento");

const inputNombre =
    document.getElementById("Nombre");

const inputEncargado =
    document.getElementById("encargado");

const inputCorreo =
    document.getElementById("correo");

const inputTelefono =
    document.getElementById("telefono");

const btnCancelar =
    document.getElementById("btnCancelar");

const inputDescripcion =
    document.getElementById("descripcion");

// Identificador del stand seleccionado en el listado
const idStand =
    sessionStorage.getItem("standModificarId");


// Función para validar todos los campos obligatorios
function validarCamposVacios(){

    let error = false;

    // Agrupa los campos del stand
    const camposObligatorios = [
        inputEvento,
        inputNombre,
        inputEncargado,
        inputCorreo,
        inputTelefono
    ];


    // Recorre los campos y valida que tengan información
    camposObligatorios.forEach(
        function(campo){

            if(campo.value.trim() === ""){

                campo.classList.add("input-error");
                error = true;

            } else{

                campo.classList.remove("input-error");
            }
        }
    );

    return error;
}


// Función para validar el teléfono
function validarTelefono(){

    let error = false;

    const telefono =
        inputTelefono.value.trim();

    // Debe contener únicamente números
    // y exactamente 8 dígitos
    if(
        isNaN(telefono) ||
        telefono.length !== 8
    ){

        inputTelefono.classList.add("input-error");
        error = true;

    } else{

        inputTelefono.classList.remove("input-error");
    }

    return error;
}


// Función para validar el correo
function validarCorreo(){

    let error = false;

    const correo =
        inputCorreo.value.trim();

    // Verifica que el correo tenga @ y .
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


// Función para cargar los datos del stand
async function cargarStandRetorno(){

    // Verifica que exista un stand seleccionado
    if(idStand === null){

        Swal.fire({
            title: "Stand no seleccionado",
            text: "Debe seleccionar un stand desde el listado.",
            icon: "warning",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Stands/listarStands.html";
        });

        return;
    }

    try{

        // Obtiene el stand por medio del service
        const stand =
            await obtenerStandPorId(
                idStand
            );

        // Carga los datos en el formulario
        inputEvento.value =
            stand.evento || "";

        inputNombre.value =
            stand.nombre || "";

        inputEncargado.value =
            stand.encargado || "";

        inputCorreo.value =
            stand.correo || "";

        inputTelefono.value =
            stand.telefono || "";

        inputDescripcion.value =
            stand.descripcion || "";

    } catch(error){

        console.error(
            "Error al cargar stand:",
            error
        );

        Swal.fire({
            title: "Error al cargar stand",
            text: "No fue posible obtener la información del stand.",
            icon: "error",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Stands/listarStands.html";
        });
    }
}


// Función principal para modificar el stand
async function modificarStandRetorno(){

    // Ejecuta las validaciones
    const errorCamposVacios =
        validarCamposVacios();

    const errorTelefono =
        validarTelefono();

    const errorCorreo =
        validarCorreo();


    // Verifica que no existan errores
    if(
        errorCamposVacios === false &&
        errorTelefono === false &&
        errorCorreo === false
    ){

        // Crea el objeto stand utilizando el modelo
        const stand =
            crearStand(
                inputEvento.value.trim(),
                inputNombre.value.trim(),
                inputEncargado.value.trim(),
                inputCorreo.value.trim(),
                inputTelefono.value.trim(),
                inputDescripcion.value.trim()
            );

        try{

            // Envía los cambios por medio del service
            const datosRespuesta =
                await modificarStand(
                    idStand,
                    stand
                );


            // Muestra mensaje de éxito
            Swal.fire({
                title: "Cambios guardados",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"

            }).then(function(){

                // Elimina el identificador temporal
                sessionStorage.removeItem(
                    "standModificarId"
                );

                // Regresa al listado
                window.location.href =
                    "/pages/Stands/listarStands.html";
            });

        } catch(error){

            console.error(
                "Error al modificar stand:",
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
            text: "Por favor revise los campos marcados en rojo.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para cancelar la modificación
function cancelarModificacionRetorno(){

    // Elimina el identificador temporal
    sessionStorage.removeItem(
        "standModificarId"
    );

    // Regresa al listado
    window.location.href =
        "/pages/Stands/listarStands.html";
}


// Evento que se ejecuta al enviar el formulario
if(formularioStand){

    formularioStand.addEventListener(
        "submit",
        function(evento){

            // Evita que el formulario
            // se envíe automáticamente
            evento.preventDefault();

            // Ejecuta la modificación
            modificarStandRetorno();
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

        cargarStandRetorno();
    }
);