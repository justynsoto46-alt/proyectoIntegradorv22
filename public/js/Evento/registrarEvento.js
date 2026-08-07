console.log("JS cargado correctamente");

const formulario = document.getElementById("formularioEvento");

const inputNombre = document.getElementById("nombreEvento");
const inputDescripcion = document.getElementById("descripcion");
const inputFechaInicio = document.getElementById("fechaInicio");
const inputFechaFin = document.getElementById("fechaFin");
const inputUbicacion = document.getElementById("ubicacion");
const inputEstado = document.getElementById("estado");


function validarNombre(){

    if(inputNombre.value.trim().length < 5){

        Swal.fire({
            icon:"error",
            title:"Nombre inválido",
            text:"Ingrese el nombre del evento. (Mínimo 5 caracteres)."
        });

        return false;
    }

    return true;
}


function validarDescripcion(){

    const longitud = inputDescripcion.value.trim().length;

    if(longitud < 10 || longitud > 1000){

        Swal.fire({
            icon:"error",
            title:"Descripción inválida",
            text:"La descripción debe contener entre 10 y 1000 caracteres."
        });

        return false;
    }

    return true;
}


function validarFechas(){

    if(inputFechaFin.value < inputFechaInicio.value){

        Swal.fire({
            icon:"error",
            title:"Fechas inválidas",
            text:"La fecha de finalización no puede ser menor que la fecha de inicio."
        });

        return false;
    }

    return true;
}


function validarUbicacion(){

    if(inputUbicacion.value.trim() === ""){

        Swal.fire({
            icon:"error",
            title:"Ubicación requerida",
            text:"Ingrese la ubicación del evento."
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


function limpiarFormulario(){

    formulario.reset();
}


// Función principal para registrar el evento en MongoDB
async function registrarEvento(){

    if(validarNombre() &&
       validarDescripcion() &&
       validarFechas() &&
       validarUbicacion() &&
       validarEstado()){

        // Crea el objeto con los datos ingresados en el formulario
        const evento = {
            nombreEvento: inputNombre.value.trim(),
            descripcion: inputDescripcion.value.trim(),
            fechaInicio: inputFechaInicio.value,
            fechaFin: inputFechaFin.value,
            ubicacion: inputUbicacion.value.trim(),
            estado: inputEstado.value
        };

        try{

            // Envía los datos del evento al backend
            const datosRespuesta = await crearDatos("/api/eventos", evento);

            Swal.fire({
                icon:"success",
                title:"Evento registrado",
                text: datosRespuesta.mensaje,
                confirmButtonText:"Aceptar"

            }).then(function(){

                limpiarFormulario();

                window.location.href = "/pages/Evento/listarEvento.html";
            });

        } catch(error){

            console.error("Error al registrar evento:", error);

            avisarError("No se pudo completar la operación", error.message);
        }
    }
}

formulario.addEventListener("submit", function(evento){

    evento.preventDefault();

    registrarEvento();
});
