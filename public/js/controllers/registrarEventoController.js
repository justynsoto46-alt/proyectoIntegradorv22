// Importa el modelo del evento
import {
    crearEvento
} from "../models/evento.js";

// Importa el servicio para registrar eventos
import {
    registrarEvento
} from "../services/eventoService.js";


// Obtiene el formulario y sus campos
const formulario =
    document.getElementById("formularioEvento");

const inputNombre =
    document.getElementById("nombreEvento");

const inputDescripcion =
    document.getElementById("descripcion");

const inputFechaInicio =
    document.getElementById("fechaInicio");

const inputFechaFin =
    document.getElementById("fechaFin");

const inputUbicacion =
    document.getElementById("ubicacion");

const inputEstado =
    document.getElementById("estado");


// Función para validar el nombre del evento
function validarNombre(){

    if(inputNombre.value.trim().length < 5){

        Swal.fire({
            icon: "error",
            title: "Nombre inválido",
            text: "Ingrese el nombre del evento. (Mínimo 5 caracteres)."
        });

        return false;
    }

    return true;
}


// Función para validar la descripción
function validarDescripcion(){

    const longitud =
        inputDescripcion.value.trim().length;

    if(longitud < 10 || longitud > 1000){

        Swal.fire({
            icon: "error",
            title: "Descripción inválida",
            text: "La descripción debe contener entre 10 y 1000 caracteres."
        });

        return false;
    }

    return true;
}


// Función para validar las fechas
function validarFechas(){

    if(inputFechaFin.value < inputFechaInicio.value){

        Swal.fire({
            icon: "error",
            title: "Fechas inválidas",
            text: "La fecha de finalización no puede ser menor que la fecha de inicio."
        });

        return false;
    }

    return true;
}


// Función para validar la ubicación
function validarUbicacion(){

    if(inputUbicacion.value.trim() === ""){

        Swal.fire({
            icon: "error",
            title: "Ubicación requerida",
            text: "Ingrese la ubicación del evento."
        });

        return false;
    }

    return true;
}


// Función para validar el estado
function validarEstado(){

    if(inputEstado.value === ""){

        Swal.fire({
            icon: "error",
            title: "Estado requerido",
            text: "Seleccione un estado."
        });

        return false;
    }

    return true;
}


// Función para limpiar el formulario
function limpiarFormulario(){

    formulario.reset();
}


// Función principal para registrar el evento
async function registrarEventoRetorno(){

    // Ejecuta todas las validaciones
    if(
        validarNombre() &&
        validarDescripcion() &&
        validarFechas() &&
        validarUbicacion() &&
        validarEstado()
    ){

        // Crea el objeto evento utilizando el modelo
        const evento =
            crearEvento(
                inputNombre.value.trim(),
                inputDescripcion.value.trim(),
                inputFechaInicio.value,
                inputFechaFin.value,
                inputUbicacion.value.trim(),
                inputEstado.value
            );

        try{

            // Envía el evento por medio del service
            const datosRespuesta =
                await registrarEvento(
                    evento
                );

            // Muestra mensaje de éxito
            Swal.fire({
                icon: "success",
                title: "Evento registrado",
                text: datosRespuesta.mensaje,
                confirmButtonText: "Aceptar"

            }).then(function(){

                // Limpia el formulario
                limpiarFormulario();

                // Redirige al listado
                window.location.href =
                    "/pages/Evento/listarEvento.html";
            });

        } catch(error){

            console.error(
                "Error al registrar evento:",
                error
            );

            Swal.fire({
                title: "No se pudo completar la operación",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    }
}


// Evento que se ejecuta al enviar el formulario
if(formulario){

    formulario.addEventListener(
        "submit",
        function(evento){

            // Evita que el formulario se envíe automáticamente
            evento.preventDefault();

            // Ejecuta el registro
            registrarEventoRetorno();
        }
    );
}