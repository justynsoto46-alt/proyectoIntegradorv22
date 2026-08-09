// Importa el modelo del evento
import {
    crearEvento
} from "../models/evento.js";

// Importa las funciones necesarias del servicio
import {
    obtenerEventoPorId,
    modificarEvento
} from "../services/eventoService.js";


// Obtiene el formulario y sus campos
const formulario =
    document.getElementById("formularioModificarEvento");

const inputNombre =
    document.getElementById("nombreEvento");

const inputDescripcion =
    document.getElementById("descripcion");

const inputFechaInicio =
    document.getElementById("fechaInicio");

const inputFechaFinal =
    document.getElementById("fechaFinal");

const inputUbicacion =
    document.getElementById("ubicacion");

const inputEstado =
    document.getElementById("estado");

const inputImagen =
    document.getElementById("imagenEvento");


// Obtiene el identificador del evento
// seleccionado desde el listado
const idEvento =
    sessionStorage.getItem("eventoModificarId");


// Función para validar el nombre
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

    if(
        inputFechaFinal.value <
        inputFechaInicio.value
    ){

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


// La imagen es opcional.
// Solo se valida cuando se selecciona un archivo.
function validarImagen(){

    // Si no se seleccionó ninguna imagen,
    // la validación es correcta
    if(
        !inputImagen ||
        inputImagen.files.length === 0
    ){

        return true;
    }

    // Obtiene el nombre del archivo seleccionado
    const nombreArchivo =
        inputImagen.files[0]
            .name
            .toLowerCase();

    // Formatos permitidos
    const formatosValidos = [
        ".jpg",
        ".jpeg",
        ".png"
    ];

    // Verifica si el archivo termina
    // con alguno de los formatos permitidos
    const esValido =
        formatosValidos.some(
            function(formato){

                return nombreArchivo.endsWith(
                    formato
                );
            }
        );

    if(!esValido){

        Swal.fire({
            icon: "error",
            title: "Formato inválido",
            text: "Seleccione una imagen en formato JPG, JPEG o PNG."
        });

        return false;
    }

    return true;
}


// Función para cargar los datos del evento
async function cargarEventoRetorno(){

    // Verifica que exista un evento seleccionado
    if(idEvento === null){

        Swal.fire({
            title: "Evento no seleccionado",
            text: "Debe seleccionar un evento desde el listado.",
            icon: "warning",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Evento/listarEvento.html";
        });

        return;
    }

    try{

        // Obtiene el evento por medio del service
        const evento =
            await obtenerEventoPorId(
                idEvento
            );

        // Coloca los datos recibidos
        // en el formulario
        inputNombre.value =
            evento.nombreEvento || "";

        inputDescripcion.value =
            evento.descripcion || "";

        inputFechaInicio.value =
            evento.fechaInicio || "";

        inputFechaFinal.value =
            evento.fechaFin || "";

        inputUbicacion.value =
            evento.ubicacion || "";

        inputEstado.value =
            evento.estado || "";

    } catch(error){

        console.error(
            "Error al cargar evento:",
            error
        );

        Swal.fire({
            title: "Error al cargar evento",
            text: "No fue posible obtener la información del evento.",
            icon: "error",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Evento/listarEvento.html";
        });
    }
}


// Función principal para guardar los cambios
async function guardarCambios(){

    // Ejecuta todas las validaciones
    if(
        validarNombre() &&
        validarDescripcion() &&
        validarFechas() &&
        validarUbicacion() &&
        validarEstado() &&
        validarImagen()
    ){

        // Crea el objeto evento utilizando el modelo
        const evento =
            crearEvento(
                inputNombre.value.trim(),
                inputDescripcion.value.trim(),
                inputFechaInicio.value,
                inputFechaFinal.value,
                inputUbicacion.value.trim(),
                inputEstado.value
            );

        try{

            // Envía los cambios por medio del service
            const datosRespuesta =
                await modificarEvento(
                    idEvento,
                    evento
                );

            // Muestra mensaje de éxito
            Swal.fire({
                icon: "success",
                title: "Cambios guardados",
                text: datosRespuesta.mensaje,
                confirmButtonText: "Aceptar"

            }).then(function(){

                // Elimina el identificador temporal
                sessionStorage.removeItem(
                    "eventoModificarId"
                );

                // Regresa al listado
                window.location.href =
                    "/pages/Evento/listarEvento.html";
            });

        } catch(error){

            console.error(
                "Error al modificar evento:",
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


// Evento que se ejecuta al enviar el formulario
if(formulario){

    formulario.addEventListener(
        "submit",
        function(evento){

            // Evita que el formulario
            // se envíe automáticamente
            evento.preventDefault();

            // Guarda los cambios
            guardarCambios();
        }
    );
}


// Carga los datos del evento
// cuando se abre la pantalla
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarEventoRetorno();
    }
);