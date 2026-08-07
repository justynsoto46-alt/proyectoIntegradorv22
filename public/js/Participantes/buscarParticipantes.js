// Se obtienen los elementos necesarios para consultar participantes por actividad
const selectActividad = document.getElementById("actividad");
const btnConsultar = document.getElementById("btnConsultar");
const tablaParticipantes = document.getElementById("tablaParticipantes");
const filasParticipantes = document.querySelectorAll(".fila-actividad");
const mensajeSinParticipantes = document.getElementById("mensajeSinParticipantes");


// Función para consultar los participantes según la actividad seleccionada
function consultarParticipantesRetorno(){

    let actividadSeleccionada = selectActividad.value;
    let cantidadParticipantes = 0;

    if(actividadSeleccionada === ""){

        // Oculta la tabla si no se selecciona ninguna actividad
        tablaParticipantes.style.display = "none";
        mensajeSinParticipantes.style.display = "none";

        Swal.fire({
            title: "Seleccione una actividad",
            text: "Debe seleccionar una actividad para consultar los participantes inscritos.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    // Muestra la tabla
    tablaParticipantes.style.display = "table";

    filasParticipantes.forEach(function(fila){

        if(fila.classList.contains(actividadSeleccionada)){
            fila.style.display = "";
            cantidadParticipantes++;
        }else{
            fila.style.display = "none";
        }
    });

    if(cantidadParticipantes === 0){

        tablaParticipantes.style.display = "none";
        mensajeSinParticipantes.style.display = "block";
    }else{
        mensajeSinParticipantes.style.display = "none";
    }
}

// Oculta la tabla al cargar la página
tablaParticipantes.style.display = "none";

// Oculta el mensaje al cargar la página
mensajeSinParticipantes.style.display = "none";

// Evento que ejecuta la consulta de participantes
btnConsultar.addEventListener("click", function(){
    consultarParticipantesRetorno();
});