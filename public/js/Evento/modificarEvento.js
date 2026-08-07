console.log("JS cargado correctamente");

const formulario = document.getElementById("formularioModificarEvento");

const inputNombre = document.getElementById("nombreEvento");
const inputDescripcion = document.getElementById("descripcion");
const inputFechaInicio = document.getElementById("fechaInicio");
const inputFechaFinal = document.getElementById("fechaFinal");
const inputUbicacion = document.getElementById("ubicacion");
const inputEstado = document.getElementById("estado");
const inputImagen = document.getElementById("imagenEvento");


// Obtiene el identificador del evento seleccionado en el listado
const idEvento = sessionStorage.getItem("eventoModificarId");


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

    if(inputFechaFinal.value < inputFechaInicio.value){

        Swal.fire({
            icon:"error",
            title:"Fechas inválidas",
            text:"La fecha de finalización no puede ser menor que la fecha de inicio."
        });

        return false;
    }

    return true;
}


// La imagen es opcional: solo se revisa el formato cuando se
// selecciona un archivo.
function validarImagen(){

    if(inputImagen.files.length === 0){

        return true;
    }

    const nombreArchivo = inputImagen.files[0].name.toLowerCase();

    const formatosValidos = [".jpg", ".jpeg", ".png"];

    const esValido = formatosValidos.some(function(formato){
        return nombreArchivo.endsWith(formato);
    });

    if(!esValido){

        Swal.fire({
            icon:"error",
            title:"Formato inválido",
            text:"Seleccione una imagen en formato JPG, JPEG o PNG."
        });

        return false;
    }

    return true;
}


// Función para cargar los datos del evento desde el backend
async function cargarEventoRetorno(){

    // Verifica que exista un evento seleccionado
    if(idEvento === null){

        Swal.fire({
            title: "Evento no seleccionado",
            text: "Debe seleccionar un evento desde el listado.",
            icon: "warning",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href = "/pages/Evento/listarEvento.html";
        });

        return;
    }

    try{

        const evento = await obtenerDatos(`/api/eventos/${idEvento}`);

        // Coloca los datos recibidos en el formulario
        inputNombre.value = evento.nombreEvento || "";
        inputDescripcion.value = evento.descripcion || "";
        inputFechaInicio.value = evento.fechaInicio || "";
        inputFechaFinal.value = evento.fechaFin || "";
        inputUbicacion.value = evento.ubicacion || "";
        inputEstado.value = evento.estado || "";

    } catch(error){

        console.error("Error al cargar evento:", error);

        Swal.fire({
            title: "Error al cargar evento",
            text: "No fue posible obtener la información del evento.",
            icon: "error",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href = "/pages/Evento/listarEvento.html";
        });
    }
}


// Función principal para guardar los cambios en MongoDB
async function guardarCambios(){

    if(validarNombre() &&
       validarDescripcion() &&
       validarFechas() &&
       validarImagen()){

        // Crea el objeto con los campos que se pueden modificar
        const datosActualizados = {
            nombreEvento: inputNombre.value.trim(),
            descripcion: inputDescripcion.value.trim(),
            fechaInicio: inputFechaInicio.value,
            fechaFin: inputFechaFinal.value,
            ubicacion: inputUbicacion.value.trim(),
            estado: inputEstado.value
        };

        try{

            const datosRespuesta = await actualizarDatos(`/api/eventos/${idEvento}`, datosActualizados);

            Swal.fire({
                icon:"success",
                title:"Cambios guardados",
                text: datosRespuesta.mensaje,
                confirmButtonText:"Aceptar"

            }).then(function(){

                // Elimina el identificador temporal
                sessionStorage.removeItem("eventoModificarId");

                window.location.href = "/pages/Evento/listarEvento.html";
            });

        } catch(error){

            console.error("Error al modificar evento:", error);

            Swal.fire({
                title: "No se pudieron guardar los cambios",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    }
}


formulario.addEventListener("submit", function(evento){

    evento.preventDefault();

    guardarCambios();
});


// Carga los datos al abrir la pantalla
document.addEventListener("DOMContentLoaded", function(){

    cargarEventoRetorno();
});
