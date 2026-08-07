console.log("JS cargado correctamente");

const formulario = document.getElementById("formularioActividad");

const inputNombre = document.getElementById("nombreActividad");
const inputEvento = document.getElementById("eventoAsociado");
const inputCategoria = document.getElementById("categoria");
const inputDescripcion = document.getElementById("descripcion");
const inputFecha = document.getElementById("fecha");
const inputHoraInicio = document.getElementById("horaInicio");
const inputHoraFin = document.getElementById("horaFin");
const inputUbicacion = document.getElementById("ubicacion");
const inputCupo = document.getElementById("cupo");
const inputResponsable = document.getElementById("responsable");
const inputEstado = document.getElementById("estado");


function validarNombre(){

    if(inputNombre.value.trim().length < 5){

        Swal.fire({
            icon:"error",
            title:"Nombre inválido",
            text:"Ingrese el nombre de la actividad. (Mínimo 5 caracteres)."
        });

        return false;
    }

    return true;
}


function validarEvento(){

    if(inputEvento.value.trim().length < 5){

        Swal.fire({
            icon:"error",
            title:"Evento inválido",
            text:"Ingrese el evento asociado. (Mínimo 5 caracteres)."
        });

        return false;
    }

    return true;
}


function validarCategoria(){

    if(inputCategoria.value === ""){

        Swal.fire({
            icon:"error",
            title:"Categoría requerida",
            text:"Seleccione una categoría."
        });

        return false;
    }

    return true;
}


function validarFecha(){

    if(inputFecha.value === ""){

        Swal.fire({
            icon:"error",
            title:"Fecha requerida",
            text:"Seleccione la fecha de la actividad."
        });

        return false;
    }

    return true;
}


function validarHoraInicio(){

    if(inputHoraInicio.value === ""){

        Swal.fire({
            icon:"error",
            title:"Hora requerida",
            text:"Seleccione la hora de inicio."
        });

        return false;
    }

    return true;
}


function validarHoraFin(){

    if(inputHoraFin.value === ""){

        Swal.fire({
            icon:"error",
            title:"Hora requerida",
            text:"Seleccione la hora de finalización."
        });

        return false;
    }

    if(inputHoraFin.value <= inputHoraInicio.value){

        Swal.fire({
            icon:"error",
            title:"Horario inválido",
            text:"La hora de finalización debe ser posterior a la hora de inicio."
        });

        return false;
    }

    return true;
}


function validarUbicacion(){

    if(inputUbicacion.value === ""){

        Swal.fire({
            icon:"error",
            title:"Ubicación requerida",
            text:"Seleccione la ubicación."
        });

        return false;
    }

    return true;
}


function validarResponsable(){

    if(inputResponsable.value === ""){

        Swal.fire({
            icon:"error",
            title:"Responsable requerido",
            text:"Seleccione un responsable."
        });

        return false;
    }

    return true;
}


function validarCupo(){

    if(inputCupo.value === "" || Number(inputCupo.value) <= 0){

        Swal.fire({
            icon:"error",
            title:"Cupo inválido",
            text:"Ingrese un cupo máximo mayor a 0."
        });

        return false;
    }

    return true;
}


function validarEstado(){

    if(inputEstado.value === ""){

        Swal.fire({
            icon:"error",
            title:"Estado requerido",
            text:"Seleccione un estado."
        });

        return false;
    }

    return true;
}


// Llena la lista de responsables con los que existen en la base de datos
async function cargarResponsablesRetorno(){

    try{

        const responsables = await obtenerDatos("/api/responsables");

        // Deja únicamente la opción inicial
        inputResponsable.innerHTML =
            '<option value="">Seleccione un responsable</option>';

        responsables.forEach(function(responsable){

            const opcion = document.createElement("option");

            opcion.value = responsable.nombreCompleto;
            opcion.textContent = responsable.nombreCompleto;

            inputResponsable.appendChild(opcion);
        });

    } catch(error){

        console.error("Error al cargar responsables:", error);
    }
}


function limpiarFormulario(){

    formulario.reset();
}


// Función principal para registrar la actividad en MongoDB
async function registrarActividad(){

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

        // Crea el objeto con los datos ingresados en el formulario
        const actividad = {
            nombreActividad: inputNombre.value.trim(),
            eventoAsociado: inputEvento.value.trim(),
            categoria: inputCategoria.value,
            descripcion: inputDescripcion.value.trim(),
            fecha: inputFecha.value,
            horaInicio: inputHoraInicio.value,
            horaFin: inputHoraFin.value,
            ubicacion: inputUbicacion.value,
            cupo: Number(inputCupo.value),
            responsable: inputResponsable.value,
            estado: inputEstado.value
        };

        try{

            const datosRespuesta = await crearDatos("/api/actividades", actividad);

            Swal.fire({
                icon:"success",
                title:"Actividad registrada",
                text: datosRespuesta.mensaje,
                confirmButtonText:"Aceptar"

            }).then(function(){

                limpiarFormulario();

                window.location.href =
                    "/pages/Actividad/listarActividad.html";
            });

        } catch(error){

            console.error("Error al registrar actividad:", error);

            avisarError("No se pudo completar la operación", error.message);
        }
    }
}


formulario.addEventListener("submit", function(evento){

    evento.preventDefault();

    registrarActividad();
});


document.addEventListener("DOMContentLoaded", function(){

    cargarResponsablesRetorno();
});
