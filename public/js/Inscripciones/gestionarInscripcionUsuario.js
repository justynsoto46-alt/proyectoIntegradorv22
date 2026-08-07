// Se obtienen los elementos necesarios para gestionar las inscripciones del participante
const inputCedula = document.getElementById("cedula");
const btnBuscarInscripciones = document.getElementById("btnBuscarInscripciones");
const contenedorInscripciones = document.getElementById("contenedorInscripciones");
const mensajeSinInscripciones = document.getElementById("mensajeSinInscripciones");
const botonesCancelar = document.querySelectorAll(".boton-cancelar");
const btnAgregarActividades = document.getElementById("btnAgregarActividades");


// Oculta las inscripciones y el mensaje al cargar la página
contenedorInscripciones.style.display = "none";
mensajeSinInscripciones.style.display = "none";
btnAgregarActividades.style.display = "none";


// Función para buscar las inscripciones del participante
function buscarInscripcionesRetorno(){

    let error = false;
    let identificacion = inputCedula.value.trim();

    if(identificacion === ""){
        error = true;
    }

    // Valida que contenga únicamente números
    if(isNaN(identificacion)){
        error = true;
    }

    // Valida que tenga mínimo 9 dígitos
    if(identificacion.length < 9){
        error = true;
    }

    // Valida que no tenga más de 15 dígitos
    if(identificacion.length > 15){
        error = true;
    }

    if(error){
        inputCedula.classList.add("input-error");

        Swal.fire({
            title: "Identificación inválida",
            text: "Ingrese una identificación válida. Debe contener solo números y tener entre 9 y 15 dígitos.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        return;
    }
        inputCedula.classList.remove("input-error");

    // Muestra las tarjetas de inscripciones quemadas en el HTML
    contenedorInscripciones.style.display = "block";

    // Oculta el mensaje de que no hay inscripciones
    mensajeSinInscripciones.style.display = "none";

    Swal.fire({
        title: "Inscripciones cargadas",
        text: "Se cargaron las actividades inscritas para la cédula ingresada.",
        icon: "success",
        confirmButtonText: "Aceptar"
    });

    btnAgregarActividades.style.display = "inline-block";
}


// Función para cancelar una inscripción
function cancelarInscripcionRetorno(boton){

    Swal.fire({
        title: "¿Cancelar inscripción?",
        text: "Esta acción cancelará su participación en la actividad seleccionada.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No cancelar"
    }).then((resultado) => {

        if(resultado.isConfirmed){

            // Obtiene la tarjeta donde se presionó el botón cancelar
            const tarjeta = boton.parentElement;

            // Oculta la tarjeta cancelada
            tarjeta.style.display = "none";

            Swal.fire({
                title: "Inscripción cancelada",
                text: "La inscripción fue cancelada correctamente y el cupo quedó disponible nuevamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });

            // Verifica si todavía quedan tarjetas visibles
            verificarInscripcionesVisibles();
        }
    });
}


// Función para verificar si quedan inscripciones visibles
function verificarInscripcionesVisibles(){

    const tarjetasInscripcion = document.querySelectorAll(".tarjeta-inscripcion");

    let cantidadVisibles = 0;

    tarjetasInscripcion.forEach(function(tarjeta){

        if(tarjeta.style.display !== "none"){
            cantidadVisibles++;
        }
    });

    if(cantidadVisibles === 0){

        // Oculta el contenedor de inscripciones
        contenedorInscripciones.style.display = "none";

        // Muestra el mensaje de que no hay inscripciones
        mensajeSinInscripciones.style.display = "block";
    }
}


// Función para redirigir a la pantalla de selección de actividades
function agregarActividadesRetorno(){

    window.location.href = "/pages/Actividad/seleccionarActividades.html";
}


// Evento para buscar las inscripciones
btnBuscarInscripciones.addEventListener("click", function(){
    buscarInscripcionesRetorno();
});


// Evento para cancelar una inscripción
botonesCancelar.forEach(function(boton){

    boton.addEventListener("click", function(){
        cancelarInscripcionRetorno(boton);
    });
});


// Evento para agregar más actividades
btnAgregarActividades.addEventListener("click", function(){
    agregarActividadesRetorno();
});