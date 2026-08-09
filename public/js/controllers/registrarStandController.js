// Importa el modelo del stand
import {
    crearStand
} from "../models/stand.js";

// Importa el servicio para registrar stands
import {
    registrarStand
} from "../services/standService.js";

// Importa el servicio de eventos
import {
    obtenerEventos
} from "../services/eventoService.js";

// Importa el servicio de responsables
import {
    obtenerResponsables
} from "../services/responsableService.js";


// Obtiene los elementos del formulario
const formularioStand =
    document.getElementById("formularioStand");

const inputNombre =
    document.getElementById("nombre");

const inputCorreo =
    document.getElementById("correo");

const inputTelefono =
    document.getElementById("telefono");

const textareaDescripcion =
    document.getElementById("descripcion");

const selectEvento =
    document.getElementById("evento");

const selectResponsable =
    document.getElementById("responsable");


// Función para validar campos obligatorios
function validarCamposVacios(){

    let error = false;

    // Valida el nombre
    if(inputNombre.value.trim() === ""){

        inputNombre.classList.add("input-error");
        error = true;

    } else{

        inputNombre.classList.remove("input-error");
    }

    // Valida el correo
    if(inputCorreo.value.trim() === ""){

        inputCorreo.classList.add("input-error");
        error = true;

    } else{

        inputCorreo.classList.remove("input-error");
    }

    // Valida el teléfono
    if(inputTelefono.value.trim() === ""){

        inputTelefono.classList.add("input-error");
        error = true;

    } else{

        inputTelefono.classList.remove("input-error");
    }

    return error;
}


// Función para validar el teléfono
function validarTelefono(){

    const telefono =
        inputTelefono.value.trim();

    // Debe contener exactamente 8 dígitos
    const error =
        !/^\d{8}$/.test(telefono);

    if(error){

        inputTelefono.classList.add("input-error");

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


// Verifica que se haya elegido
// un evento y un responsable
function validarSelecciones(){

    let error = false;

    // Valida el evento
    if(
        selectEvento.value === "" ||
        selectEvento.value === "defecto"
    ){

        selectEvento.classList.add("input-error");
        error = true;

    } else{

        selectEvento.classList.remove("input-error");
    }

    // Valida el responsable
    if(
        selectResponsable.value === "" ||
        selectResponsable.value === "defecto"
    ){

        selectResponsable.classList.add("input-error");
        error = true;

    } else{

        selectResponsable.classList.remove("input-error");
    }

    return error;
}


// Carga los eventos desde MongoDB
async function cargarEventosRetorno(){

    try{

        // Obtiene los eventos por medio del service
        const eventos =
            await obtenerEventos();

        // Limpia las opciones existentes
        selectEvento.innerHTML =
            '<option value="">Seleccione una opción</option>';

        // Agrega los eventos al select
        eventos.forEach(function(evento){

            const opcion =
                document.createElement("option");

            opcion.value =
                evento.nombreEvento;

            opcion.textContent =
                evento.nombreEvento;

            selectEvento.appendChild(
                opcion
            );
        });

    } catch(error){

        console.error(
            "Error al cargar eventos:",
            error
        );
    }
}


// Carga los responsables desde MongoDB
async function cargarResponsablesRetorno(){

    try{

        // Obtiene los responsables por medio del service
        const responsables =
            await obtenerResponsables();

        // Limpia las opciones existentes
        selectResponsable.innerHTML =
            '<option value="">Seleccione una opción</option>';

        // Agrega los responsables al select
        responsables.forEach(function(responsable){

            const opcion =
                document.createElement("option");

            opcion.value =
                responsable.nombreCompleto;

            opcion.textContent =
                responsable.nombreCompleto;

            selectResponsable.appendChild(
                opcion
            );
        });

    } catch(error){

        console.error(
            "Error al cargar responsables:",
            error
        );
    }
}


// Función principal para registrar el stand
async function registrarStandRetorno(){

    // Ejecuta todas las validaciones
    if(
        validarCamposVacios() === false &&
        validarCorreo() === false &&
        validarTelefono() === false &&
        validarSelecciones() === false
    ){

        // Crea el objeto stand utilizando el modelo
        const stand =
            crearStand(
                selectEvento.value,
                inputNombre.value.trim(),
                selectResponsable.value,
                inputCorreo.value.trim(),
                inputTelefono.value.trim(),
                textareaDescripcion.value.trim()
            );

        try{

            // Envía el stand por medio del service
            const datosRespuesta =
                await registrarStand(
                    stand
                );

            // Muestra mensaje de éxito
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
                    "/pages/Stands/listarStands.html";
            });

        } catch(error){

            console.error(
                "Error al registrar stand:",
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
    inputNombre.value = "";
    inputCorreo.value = "";
    inputTelefono.value = "";
    textareaDescripcion.value = "";

    selectEvento.value = "";
    selectResponsable.value = "";

    // Elimina los estilos de error
    inputNombre.classList.remove("input-error");
    inputCorreo.classList.remove("input-error");
    inputTelefono.classList.remove("input-error");

    selectEvento.classList.remove("input-error");
    selectResponsable.classList.remove("input-error");
}


// Evento del formulario
if(formularioStand){

    formularioStand.addEventListener(
        "submit",
        function(evento){

            // Evita que se envíe automáticamente
            evento.preventDefault();

            // Ejecuta el registro
            registrarStandRetorno();
        }
    );
}


// Carga eventos y responsables
// cuando abre la pantalla
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarEventosRetorno();
        cargarResponsablesRetorno();
    }
);