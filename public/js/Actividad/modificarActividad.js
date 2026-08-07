// Se obtienen los elementos del formulario de modificación de actividad
const formulario = document.querySelector(".formulario");

const inputIdActividad = document.getElementById("idActividad");
const inputNombre = document.getElementById("nombreActividad");
const inputCategoria = document.getElementById("categoria");
const inputDescripcion = document.getElementById("descripcion");
const inputFecha = document.getElementById("fecha");
const inputHoraInicio = document.getElementById("horaInicio");
const inputHoraFin = document.getElementById("horaFin");
const inputEspacio = document.getElementById("espacio");
const inputCupo = document.getElementById("cupo");
const inputResponsable = document.getElementById("responsable");
const inputEstado = document.getElementById("estado");


// Obtiene el identificador de la actividad seleccionada en el listado
const idActividad = sessionStorage.getItem("actividadModificarId");


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


function validarHoraFin(){

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


// Llena la lista de responsables con los que existen en la base de datos.
// Recibe el responsable actual para dejarlo seleccionado.
async function cargarResponsablesRetorno(responsableActual){

    try{

        const responsables = await obtenerDatos("/api/responsables");

        inputResponsable.innerHTML = "";

        responsables.forEach(function(responsable){

            const opcion = document.createElement("option");

            opcion.value = responsable.nombreCompleto;
            opcion.textContent = responsable.nombreCompleto;

            inputResponsable.appendChild(opcion);
        });

        // Si el responsable guardado ya no está en la lista, se agrega
        // para no perder el dato al guardar.
        if(responsableActual !== "" &&
           inputResponsable.querySelector(
               `option[value="${responsableActual}"]`) === null){

            const opcion = document.createElement("option");

            opcion.value = responsableActual;
            opcion.textContent = responsableActual;

            inputResponsable.appendChild(opcion);
        }

        inputResponsable.value = responsableActual;

    } catch(error){

        console.error("Error al cargar responsables:", error);
    }
}


// Función para cargar los datos de la actividad desde el backend
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

        const actividad = await obtenerDatos(`/api/actividades/${idActividad}`);

        // Coloca los datos recibidos en el formulario
        inputIdActividad.value = actividad._id;
        inputNombre.value = actividad.nombreActividad || "";
        inputCategoria.value = actividad.categoria || "";
        inputDescripcion.value = actividad.descripcion || "";
        inputFecha.value = actividad.fecha || "";
        inputHoraInicio.value = actividad.horaInicio || "";
        inputHoraFin.value = actividad.horaFin || "";
        inputEspacio.value = actividad.ubicacion || "";
        inputCupo.value = actividad.cupo || "";
        inputEstado.value = actividad.estado || "";

        await cargarResponsablesRetorno(actividad.responsable || "");

    } catch(error){

        console.error("Error al cargar actividad:", error);

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


// Función principal para guardar los cambios en MongoDB
async function modificarActividadRetorno(){

    if(validarNombre() && validarHoraFin() && validarCupo()){

        // Crea el objeto con los campos que se pueden modificar
        const datosActualizados = {
            nombreActividad: inputNombre.value.trim(),
            categoria: inputCategoria.value,
            descripcion: inputDescripcion.value.trim(),
            fecha: inputFecha.value,
            horaInicio: inputHoraInicio.value,
            horaFin: inputHoraFin.value,
            ubicacion: inputEspacio.value.trim(),
            cupo: Number(inputCupo.value),
            responsable: inputResponsable.value,
            estado: inputEstado.value
        };

        try{

            const datosRespuesta = await actualizarDatos(`/api/actividades/${idActividad}`, datosActualizados);

            Swal.fire({
                icon: "success",
                title: "¡Actividad modificada!",
                text: datosRespuesta.mensaje,
                confirmButtonColor: "#164a98"

            }).then(function(){

                sessionStorage.removeItem("actividadModificarId");

                window.location.href =
                    "/pages/Actividad/listarActividad.html";
            });

        } catch(error){

            console.error("Error al modificar actividad:", error);

            Swal.fire({
                title: "No se pudieron guardar los cambios",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    }
}


formulario.addEventListener("submit", function(event){

    event.preventDefault();

    modificarActividadRetorno();
});


// Carga los datos al abrir la pantalla
document.addEventListener("DOMContentLoaded", function(){

    cargarActividadRetorno();
});
