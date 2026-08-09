// Importa el modelo de la actividad
import {
    crearActividad
} from "../models/actividad.js";

// Importa las funciones necesarias del servicio de actividades
import {
    obtenerActividadPorId,
    modificarActividad
} from "../services/actividadService.js";

// Importa el servicio de responsables
import {
    obtenerResponsables
} from "../services/responsableService.js";


// Se obtienen los elementos del formulario de modificación
const formulario =
    document.querySelector(".formulario");

const inputIdActividad =
    document.getElementById("idActividad");

const inputNombre =
    document.getElementById("nombreActividad");

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

const inputEspacio =
    document.getElementById("espacio");

const inputCupo =
    document.getElementById("cupo");

const inputResponsable =
    document.getElementById("responsable");

const inputEstado =
    document.getElementById("estado");


// Obtiene el identificador de la actividad seleccionada
const idActividad =
    sessionStorage.getItem("actividadModificarId");


// Guarda temporalmente el evento asociado
// para no perderlo durante la modificación
let eventoAsociadoGuardado = "";


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


// Función para validar el horario
function validarHoraFin(){

    if(inputHoraInicio.value === ""){

        Swal.fire({
            icon: "error",
            title: "Hora requerida",
            text: "Seleccione la hora de inicio."
        });

        return false;
    }


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


// Función para validar la ubicación
function validarUbicacion(){

    if(inputEspacio.value.trim() === ""){

        Swal.fire({
            icon: "error",
            title: "Ubicación requerida",
            text: "Seleccione o ingrese una ubicación."
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


// Llena la lista de responsables utilizando el service.
// Recibe el responsable actual para dejarlo seleccionado.
async function cargarResponsablesRetorno(responsableActual){

    try{

        // Obtiene los responsables desde MongoDB
        const responsables =
            await obtenerResponsables();

        // Limpia las opciones existentes
        inputResponsable.innerHTML = "";

        // Agrega cada responsable como opción
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


        // Si el responsable anterior ya no existe
        // en la base de datos, se conserva temporalmente
        if(
            responsableActual !== "" &&
            inputResponsable.querySelector(
                `option[value="${responsableActual}"]`
            ) === null
        ){

            const opcion =
                document.createElement("option");

            opcion.value =
                responsableActual;

            opcion.textContent =
                responsableActual;

            inputResponsable.appendChild(
                opcion
            );
        }


        // Deja seleccionado el responsable actual
        inputResponsable.value =
            responsableActual;

    } catch(error){

        console.error(
            "Error al cargar responsables:",
            error
        );
    }
}


// Función para cargar los datos de la actividad
async function cargarActividadRetorno(){

    // Verifica que exista una actividad seleccionada
    if(idActividad === null){

        Swal.fire({
            title: "Actividad no seleccionada",
            text: "Debe seleccionar una actividad desde el listado.",
            icon: "warning",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Actividad/listarActividad.html";
        });

        return;
    }

    try{

        // Obtiene la actividad por medio del service
        const actividad =
            await obtenerActividadPorId(
                idActividad
            );


        // Guarda el evento asociado actual
        eventoAsociadoGuardado =
            actividad.eventoAsociado || "";


        // Coloca los datos recibidos en el formulario
        if(inputIdActividad){

            inputIdActividad.value =
                actividad._id || "";
        }

        inputNombre.value =
            actividad.nombreActividad || "";

        inputCategoria.value =
            actividad.categoria || "";

        inputDescripcion.value =
            actividad.descripcion || "";

        inputFecha.value =
            actividad.fecha || "";

        inputHoraInicio.value =
            actividad.horaInicio || "";

        inputHoraFin.value =
            actividad.horaFin || "";

        inputEspacio.value =
            actividad.ubicacion || "";

        inputCupo.value =
            actividad.cupo || "";

        inputEstado.value =
            actividad.estado || "";


        // Carga los responsables
        // y selecciona el actual
        await cargarResponsablesRetorno(
            actividad.responsable || ""
        );

    } catch(error){

        console.error(
            "Error al cargar actividad:",
            error
        );

        Swal.fire({
            title: "Error al cargar actividad",
            text: "No fue posible obtener la información de la actividad.",
            icon: "error",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Actividad/listarActividad.html";
        });
    }
}


// Función principal para guardar los cambios
async function modificarActividadRetorno(){

    // Ejecuta las validaciones
    if(
        validarNombre() &&
        validarFecha() &&
        validarHoraFin() &&
        validarUbicacion() &&
        validarResponsable() &&
        validarCupo()
    ){

        // Crea el objeto actividad utilizando el modelo
        const actividad =
            crearActividad(
                inputNombre.value.trim(),
                eventoAsociadoGuardado,
                inputCategoria.value,
                inputDescripcion.value.trim(),
                inputFecha.value,
                inputHoraInicio.value,
                inputHoraFin.value,
                inputEspacio.value.trim(),
                inputCupo.value,
                inputResponsable.value,
                inputEstado.value
            );

        try{

            // Envía los cambios por medio del service
            const datosRespuesta =
                await modificarActividad(
                    idActividad,
                    actividad
                );


            Swal.fire({
                icon: "success",
                title: "¡Actividad modificada!",
                text: datosRespuesta.mensaje,
                confirmButtonColor: "#164a98"

            }).then(function(){

                // Elimina el identificador temporal
                sessionStorage.removeItem(
                    "actividadModificarId"
                );

                // Regresa al listado
                window.location.href =
                    "/pages/Actividad/listarActividad.html";
            });

        } catch(error){

            console.error(
                "Error al modificar actividad:",
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

            // Evita que el formulario se envíe automáticamente
            evento.preventDefault();

            // Ejecuta la modificación
            modificarActividadRetorno();
        }
    );
}


// Carga los datos al abrir la pantalla
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarActividadRetorno();
    }
);