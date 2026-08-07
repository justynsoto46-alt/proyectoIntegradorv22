// Se obtienen los elementos necesarios para gestionar la inscripción a actividades
const botonesInscribir = document.querySelectorAll(".boton-inscribir");
const botonesQuitar = document.querySelectorAll(".boton-quitar");
const btnFinalizar = document.getElementById("btnFinalizar");


// Arreglo para guardar las actividades inscritas durante esta sesión
let actividadesInscritas = [];

// Oculta todos los botones Quitar selección al cargar la página
botonesQuitar.forEach(function(boton){

    boton.style.display = "none";
});

// Función para obtener los datos de una actividad
function obtenerDatosActividad(boton){

    const tarjeta = boton.parentElement;

    const nombreActividad = tarjeta.querySelector("h3").textContent.trim();

    const fechaActividad = tarjeta.getAttribute("data-fecha");
    const inicioActividad = Number(tarjeta.getAttribute("data-inicio"));
    const finActividad = Number(tarjeta.getAttribute("data-fin"));

    const cuposActividad = tarjeta.querySelector(".cupos");

    return {
        tarjeta: tarjeta,
        nombre: nombreActividad,
        fecha: fechaActividad,
        inicio: inicioActividad,
        fin: finActividad,
        cupos: cuposActividad
    };
}

// Función para validar que el participante no se inscriba dos veces
function validarActividadRepetida(nombreActividad){

    let actividadRepetida = false;

    actividadesInscritas.forEach(function(actividad){

        if(actividad.nombre === nombreActividad){
            actividadRepetida = true;
        }

    });

    return actividadRepetida;
}

// Función para validar conflictos de horario
function validarChoqueHorario(fechaActividad, inicioActividad, finActividad){

    let existeConflicto = false;

    actividadesInscritas.forEach(function(actividad){

        if(actividad.fecha === fechaActividad &&
           inicioActividad < actividad.fin &&
           finActividad > actividad.inicio){

            existeConflicto = true;

        }
    });

    return existeConflicto;
}

// Función para inscribir al participante en una actividad
function inscribirActividadRetorno(boton){

    // Obtiene los datos de la actividad seleccionada
    const datosActividad = obtenerDatosActividad(boton);

    // Verifica si el participante ya está inscrito en la actividad
    if(validarActividadRepetida(datosActividad.nombre)){

        Swal.fire({
            title: "Inscripción duplicada",
            text: "Ya se encuentra inscrito en esta actividad.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        return;
    }

    // Verifica si existe un conflicto de horario
    if(validarChoqueHorario(datosActividad.fecha,
                            datosActividad.inicio,
                            datosActividad.fin)){

        Swal.fire({
            title: "Conflicto de horario",
            text: "La actividad seleccionada se traslapa con otra actividad inscrita.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        return;
    }

    // Obtiene la cantidad de cupos disponibles
    let cuposDisponibles = Number(datosActividad.cupos.textContent);

    // Verifica si aún existen cupos
    if(cuposDisponibles <= 0){

        Swal.fire({
            title: "Sin cupos disponibles",
            text: "La actividad ya no cuenta con espacios disponibles.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });

        return;
    }

    // Guarda la actividad inscrita
    actividadesInscritas.push({
        nombre: datosActividad.nombre,
        fecha: datosActividad.fecha,
        inicio: datosActividad.inicio,
        fin: datosActividad.fin
    });

    // Disminuye la cantidad de cupos disponibles
    cuposDisponibles--;
    datosActividad.cupos.textContent = cuposDisponibles;

    // Obtiene el botón Quitar selección
    const botonQuitar = boton.nextElementSibling;

    // Muestra el botón Quitar selección
    botonQuitar.style.display = "inline-block";

    // Si ya no quedan cupos, cambia el botón
    if(cuposDisponibles === 0){

        boton.textContent = "Sin cupos";
        boton.disabled = true;
        boton.classList.remove("boton-inscribir");
        boton.classList.add("boton-sin-cupos");

    }else{

        boton.textContent = "Inscrito";
        boton.disabled = true;

    }

    Swal.fire({
        title: "Inscripción realizada",
        text: "La actividad fue agregada correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar"
    });
}

// Función para quitar una actividad seleccionada
function quitarSeleccionRetorno(boton){

    const tarjeta = boton.parentElement;

    const nombreActividad = tarjeta.querySelector("h3").textContent.trim();

    // Elimina la actividad del arreglo
    actividadesInscritas = actividadesInscritas.filter(function(actividad){

        return actividad.nombre !== nombreActividad;

    });

    // Aumenta nuevamente el cupo
    const cupos = tarjeta.querySelector(".cupos");

    let cuposDisponibles = Number(cupos.textContent);

    cuposDisponibles++;

    cupos.textContent = cuposDisponibles;

    // Obtiene nuevamente el botón Inscribirme
    const botonInscribir = boton.previousElementSibling;

    botonInscribir.textContent = "Inscribirme";
    botonInscribir.disabled = false;
    botonInscribir.classList.remove("boton-sin-cupos");
    botonInscribir.classList.add("boton-inscribir");

    // Oculta nuevamente el botón Quitar selección
    boton.style.display = "none";

    Swal.fire({
        title: "Actividad eliminada",
        text: "La actividad fue quitada de su selección.",
        icon: "success",
        confirmButtonText: "Aceptar"
    });

}

// Agrega el evento click a todos los botones Inscribirme
botonesInscribir.forEach(function(boton){

    boton.addEventListener("click", function(){
        inscribirActividadRetorno(boton);

    });
});

// Agrega el evento click a todos los botones Quitar selección
botonesQuitar.forEach(function(boton){

    boton.addEventListener("click", function(){
        quitarSeleccionRetorno(boton);

    });
});

// Evento para finalizar la inscripción
btnFinalizar.addEventListener("click", function(){

    if(actividadesInscritas.length === 0){

        Swal.fire({
            title: "No hay actividades seleccionadas",
            text: "Debe inscribirse al menos en una actividad antes de finalizar.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

    } else{

        Swal.fire({
            title: "Inscripción finalizada",
            text: "Su inscripción fue completada correctamente.",
            icon: "success",
            confirmButtonText: "Volver al inicio"
        }).then(() => {

            window.location.href = "/pages/Inscripciones/inscripciones.html";

        });
    }
});