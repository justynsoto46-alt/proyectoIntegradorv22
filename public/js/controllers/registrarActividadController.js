// Importa el modelo de la actividad
import {
    crearActividad
} from "../models/actividad.js";

// Importa el servicio para registrar actividades
import {
    registrarActividad
} from "../services/actividadService.js";

// Importa el servicio de responsables
import {
    obtenerResponsables
} from "../services/responsableService.js";

// Importa el servicio de eventos
import {
    obtenerEventos
} from "../services/eventoService.js";


// Obtiene el formulario y sus campos
const formulario =
    document.getElementById("formularioActividad");

const inputNombre =
    document.getElementById("nombreActividad");

const inputEvento =
    document.getElementById("eventoAsociado");

const inputCategoria =
    document.getElementById("categoria");

const inputDescripcion =
    document.getElementById("descripcion");

const inputFecha =
    document.getElementById("fecha");

const inputHoraInicio =
    document.getElementById("horaInicio");

const inputHoraFin =
    document.getElementById("horaFin");

const inputUbicacion =
    document.getElementById("ubicacion");

const inputCupo =
    document.getElementById("cupo");

const inputResponsable =
    document.getElementById("responsable");

const inputEstado =
    document.getElementById("estado");


// Función para validar el nombre
function validarNombre(){

    if(inputNombre.value.trim().length < 5){

        Swal.fire({
            icon: "error",
            title: "Nombre inválido",
            text: "Ingrese el nombre de la actividad. (Mínimo 5 caracteres)."
        });

        return false;
    }

    return true;
}


// Función para validar el evento
function validarEvento(){

    if(inputEvento.value === ""){

        Swal.fire({
            icon: "error",
            title: "Evento requerido",
            text: "Seleccione un evento asociado."
        });

        return false;
    }

    return true;
}


// Función para validar la categoría
function validarCategoria(){

    if(inputCategoria.value === ""){

        Swal.fire({
            icon: "error",
            title: "Categoría requerida",
            text: "Seleccione una categoría."
        });

        return false;
    }

    return true;
}


// Función para validar la fecha
function validarFecha(){

    if(inputFecha.value === ""){

        Swal.fire({
            icon: "error",
            title: "Fecha requerida",
            text: "Seleccione la fecha de la actividad."
        });

        return false;
    }

    return true;
}


// Función para validar la hora de inicio
function validarHoraInicio(){

    if(inputHoraInicio.value === ""){

        Swal.fire({
            icon: "error",
            title: "Hora requerida",
            text: "Seleccione la hora de inicio."
        });

        return false;
    }

    return true;
}


// Función para validar la hora de finalización
function validarHoraFin(){

    if(inputHoraFin.value === ""){

        Swal.fire({
            icon: "error",
            title: "Hora requerida",
            text: "Seleccione la hora de finalización."
        });

        return false;
    }

    if(inputHoraFin.value <= inputHoraInicio.value){

        Swal.fire({
            icon: "error",
            title: "Horario inválido",
            text: "La hora de finalización debe ser posterior a la hora de inicio."
        });

        return false;
    }

    return true;
}


// Función para validar la ubicación
function validarUbicacion(){

    if(inputUbicacion.value === ""){

        Swal.fire({
            icon: "error",
            title: "Ubicación requerida",
            text: "Seleccione la ubicación."
        });

        return false;
    }

    return true;
}


// Función para validar el responsable
function validarResponsable(){

    if(inputResponsable.value === ""){

        Swal.fire({
            icon: "error",
            title: "Responsable requerido",
            text: "Seleccione un responsable."
        });

        return false;
    }

    return true;
}


// Función para validar el cupo
function validarCupo(){

    if(
        inputCupo.value === "" ||
        Number(inputCupo.value) <= 0
    ){

        Swal.fire({
            icon: "error",
            title: "Cupo inválido",
            text: "Ingrese un cupo máximo mayor a 0."
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


// Carga los responsables desde MongoDB
async function cargarResponsablesRetorno(){

    try{

        const responsables =
            await obtenerResponsables();

        inputResponsable.innerHTML =
            '<option value="">Seleccione un responsable</option>';

        responsables.forEach(
            function(responsable){

                const opcion =
                    document.createElement("option");

                opcion.value =
                    responsable.nombreCompleto;

                opcion.textContent =
                    responsable.nombreCompleto;

                inputResponsable.appendChild(
                    opcion
                );
            }
        );

    } catch(error){

        console.error(
            "Error al cargar responsables:",
            error
        );
    }
}


// Carga los eventos desde MongoDB
async function cargarEventosRetorno(){

    try{

        const eventos =
            await obtenerEventos();

        inputEvento.innerHTML =
            '<option value="">Seleccione un evento</option>';

        eventos.forEach(
            function(evento){

                const opcion =
                    document.createElement("option");

                opcion.value =
                    evento.nombreEvento;

                opcion.textContent =
                    evento.nombreEvento;

                inputEvento.appendChild(
                    opcion
                );
            }
        );

    } catch(error){

        console.error(
            "Error al cargar eventos:",
            error
        );
    }
}


// Función para limpiar el formulario
function limpiarFormulario(){

    formulario.reset();
}


// Función principal para registrar la actividad
async function registrarActividadRetorno(){

    if(
        validarNombre() &&
        validarEvento() &&
        validarCategoria() &&
        validarFecha() &&
        validarHoraInicio() &&
        validarHoraFin() &&
        validarUbicacion() &&
        validarResponsable() &&
        validarCupo() &&
        validarEstado()
    ){

        // Crea el objeto actividad utilizando el modelo
        const actividad =
            crearActividad(
                inputNombre.value.trim(),
                inputEvento.value,
                inputCategoria.value,
                inputDescripcion.value.trim(),
                inputFecha.value,
                inputHoraInicio.value,
                inputHoraFin.value,
                inputUbicacion.value,
                inputCupo.value,
                inputResponsable.value,
                inputEstado.value
            );

        try{

            // Envía la actividad por medio del service
            const datosRespuesta =
                await registrarActividad(
                    actividad
                );

            Swal.fire({
                icon: "success",
                title: "Actividad registrada",
                text: datosRespuesta.mensaje,
                confirmButtonText: "Aceptar"

            }).then(function(){

                limpiarFormulario();

                window.location.href =
                    "/pages/Actividad/listarActividad.html";
            });

        } catch(error){

            console.error(
                "Error al registrar actividad:",
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


// Evento del formulario
if(formulario){

    formulario.addEventListener(
        "submit",
        function(evento){

            evento.preventDefault();

            registrarActividadRetorno();
        }
    );
}


// Carga eventos y responsables al abrir la página
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarEventosRetorno();
        cargarResponsablesRetorno();
    }
);