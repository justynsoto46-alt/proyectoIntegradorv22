// Importa el modelo de inscripción
import {
    crearInscripcion
} from "../models/inscripcion.js";

// Importa el servicio de actividades
import {
    obtenerActividades
} from "../services/actividadService.js";

// Importa el servicio de inscripciones
import {
    registrarInscripcion
} from "../services/inscripcionService.js";


// Obtiene los elementos de la pantalla
const contenedorActividades =
    document.getElementById("contenedorActividades");

const btnFinalizar =
    document.getElementById("btnFinalizar");


// Obtiene el participante que acaba de registrarse
const participanteId =
    sessionStorage.getItem("participanteId");


// Arreglo para guardar temporalmente
// las actividades seleccionadas
let actividadesSeleccionadas = [];


// Arreglo con todas las actividades obtenidas
// desde MongoDB
let actividadesRegistradas = [];


// Función para validar si una actividad
// ya fue seleccionada
function validarActividadRepetida(idActividad){

    return actividadesSeleccionadas.some(
        function(actividad){

            return actividad._id === idActividad;
        }
    );
}


// Función para validar choques de horario
function validarChoqueHorario(
    actividadSeleccionada
){

    return actividadesSeleccionadas.some(
        function(actividad){

            // Solo existe conflicto si
            // las actividades son el mismo día
            if(
                actividad.fecha !==
                actividadSeleccionada.fecha
            ){

                return false;
            }

            // Verifica el traslape de horarios
            return (
                actividadSeleccionada.horaInicio <
                    actividad.horaFin &&
                actividadSeleccionada.horaFin >
                    actividad.horaInicio
            );
        }
    );
}


// Función para actualizar visualmente
// una tarjeta después de seleccionarla
function marcarActividadSeleccionada(
    tarjeta,
    actividad
){

    const botonInscribir =
        tarjeta.querySelector(
            ".boton-inscribir"
        );

    const botonQuitar =
        tarjeta.querySelector(
            ".boton-quitar"
        );

    const textoCupos =
        tarjeta.querySelector(
            ".cupos"
        );


    // Disminuye visualmente un cupo
    let cuposDisponibles =
        Number(textoCupos.textContent);

    cuposDisponibles--;

    textoCupos.textContent =
        cuposDisponibles;


    // Deshabilita el botón Inscribirme
    botonInscribir.disabled = true;

    if(cuposDisponibles === 0){

        botonInscribir.textContent =
            "Sin cupos";

        botonInscribir.classList.add(
            "boton-sin-cupos"
        );

    } else{

        botonInscribir.textContent =
            "Seleccionada";
    }


    // Muestra el botón para quitar selección
    botonQuitar.style.display =
        "inline-block";
}


// Función para seleccionar una actividad
function seleccionarActividadRetorno(
    actividad,
    tarjeta
){

    // Verifica que no esté repetida
    if(
        validarActividadRepetida(
            actividad._id
        )
    ){

        Swal.fire({
            title: "Inscripción duplicada",
            text: "Ya seleccionó esta actividad.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        return;
    }


    // Verifica conflictos de horario
    if(
        validarChoqueHorario(
            actividad
        )
    ){

        Swal.fire({
            title: "Conflicto de horario",
            text: "La actividad seleccionada se traslapa con otra actividad.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        return;
    }


    // Obtiene los cupos mostrados
    const cuposDisponibles =
        Number(
            tarjeta.querySelector(
                ".cupos"
            ).textContent
        );


    // Verifica que existan cupos
    if(cuposDisponibles <= 0){

        Swal.fire({
            title: "Sin cupos disponibles",
            text: "La actividad ya no cuenta con espacios disponibles.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });

        return;
    }


    // Guarda temporalmente la actividad
    actividadesSeleccionadas.push(
        actividad
    );


    // Actualiza la tarjeta
    marcarActividadSeleccionada(
        tarjeta,
        actividad
    );


    Swal.fire({
        title: "Actividad seleccionada",
        text: "La actividad fue agregada a su selección.",
        icon: "success",
        confirmButtonText: "Aceptar"
    });
}


// Función para quitar una actividad
// de la selección
function quitarActividadRetorno(
    actividad,
    tarjeta
){

    // Elimina la actividad del arreglo
    actividadesSeleccionadas =
        actividadesSeleccionadas.filter(
            function(actividadSeleccionada){

                return (
                    actividadSeleccionada._id !==
                    actividad._id
                );
            }
        );


    const botonInscribir =
        tarjeta.querySelector(
            ".boton-inscribir"
        );

    const botonQuitar =
        tarjeta.querySelector(
            ".boton-quitar"
        );

    const textoCupos =
        tarjeta.querySelector(
            ".cupos"
        );


    // Devuelve visualmente el cupo
    let cuposDisponibles =
        Number(textoCupos.textContent);

    cuposDisponibles++;

    textoCupos.textContent =
        cuposDisponibles;


    // Restaura el botón
    botonInscribir.textContent =
        "Inscribirme";

    botonInscribir.disabled =
        false;

    botonInscribir.classList.remove(
        "boton-sin-cupos"
    );


    // Oculta el botón quitar
    botonQuitar.style.display =
        "none";


    Swal.fire({
        title: "Actividad eliminada",
        text: "La actividad fue quitada de su selección.",
        icon: "success",
        confirmButtonText: "Aceptar"
    });
}


// Función para crear las tarjetas
function mostrarActividadesRetorno(
    actividades
){

    // Limpia las tarjetas anteriores
    contenedorActividades.innerHTML = "";


    // Verifica si existen actividades
    if(actividades.length === 0){

        contenedorActividades.innerHTML =
            "<p>No hay actividades disponibles.</p>";

        return;
    }


    // Recorre las actividades
    actividades.forEach(
        function(actividad){

            // Crea una tarjeta
            const tarjeta =
                document.createElement(
                    "div"
                );

            tarjeta.classList.add(
                "tarjeta-actividad"
            );


            // Obtiene el cupo disponible
            const cuposDisponibles =
                Number(actividad.cupo ?? 0);


            // Agrega la información de la actividad
            tarjeta.innerHTML = `

                <h3>
                    ${actividad.nombreActividad}
                </h3>

                <p>
                    <strong>Evento:</strong>
                    ${actividad.eventoAsociado || ""}
                </p>

                <p>
                    <strong>Categoría:</strong>
                    ${actividad.categoria || ""}
                </p>

                <p>
                    <strong>Fecha:</strong>
                    ${actividad.fecha || ""}
                </p>

                <p>
                    <strong>Horario:</strong>
                    ${actividad.horaInicio || ""}
                    -
                    ${actividad.horaFin || ""}
                </p>

                <p>
                    <strong>Ubicación:</strong>
                    ${actividad.ubicacion || ""}
                </p>

                <p>
                    <strong>Responsable:</strong>
                    ${actividad.responsable || ""}
                </p>

                <p>
                    <strong>Cupos disponibles:</strong>

                    <span class="cupos">
                        ${cuposDisponibles}
                    </span>
                </p>


                <button
                    type="button"
                    class="${
                        cuposDisponibles > 0
                            ? "boton-inscribir"
                            : "boton-sin-cupos"
                    }"
                    ${
                        cuposDisponibles <= 0
                            ? "disabled"
                            : ""
                    }>

                    ${
                        cuposDisponibles > 0
                            ? "Inscribirme"
                            : "Sin cupos"
                    }

                </button>


                <button
                    type="button"
                    class="boton-quitar"
                    style="display:none;">

                    Quitar selección

                </button>
            `;


            // Obtiene el botón Inscribirme.
            // Si no hay cupos, este selector devuelve null
            // porque el botón tendrá la clase boton-sin-cupos.
            const botonInscribir =
                tarjeta.querySelector(
                    ".boton-inscribir"
                );


            // Obtiene el botón Quitar selección
            const botonQuitar =
                tarjeta.querySelector(
                    ".boton-quitar"
                );


            // Agrega el evento solamente si
            // la actividad tiene cupos disponibles
            if(botonInscribir){

                botonInscribir.addEventListener(
                    "click",
                    function(){

                        seleccionarActividadRetorno(
                            actividad,
                            tarjeta
                        );
                    }
                );
            }


            // Evento para quitar la actividad
            // de la selección temporal
            botonQuitar.addEventListener(
                "click",
                function(){

                    quitarActividadRetorno(
                        actividad,
                        tarjeta
                    );
                }
            );


            // Agrega la tarjeta a la página
            contenedorActividades.appendChild(
                tarjeta
            );
        }
    );
}


// Función para cargar las actividades
// reales desde MongoDB
async function cargarActividadesRetorno(){

    try{

        // Obtiene las actividades por medio del service
        const actividades =
            await obtenerActividades();


        // Solo muestra actividades activas
        actividadesRegistradas =
            actividades.filter(
                function(actividad){

                    return (
                        actividad.estado ===
                        "Activo"
                    );
                }
            );


        // Muestra las tarjetas
        mostrarActividadesRetorno(
            actividadesRegistradas
        );

    } catch(error){

        console.error(
            "Error al cargar actividades:",
            error
        );

        Swal.fire({
            title: "Error al cargar actividades",
            text: "No fue posible obtener las actividades disponibles.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para finalizar todas
// las inscripciones seleccionadas
async function finalizarInscripcionRetorno(){

    // Verifica que exista un participante identificado
    if(!participanteId){

        Swal.fire({
            title: "Participante no identificado",
            text: "No fue posible identificar al participante.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });

        return;
    }


    // Verifica que se haya seleccionado
    // al menos una actividad
    if(actividadesSeleccionadas.length === 0){

        Swal.fire({
            title: "No hay actividades seleccionadas",
            text: "Debe seleccionar al menos una actividad antes de finalizar.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        return;
    }


    try{

        // Deshabilita temporalmente el botón
        // para evitar varios clics seguidos
        btnFinalizar.disabled = true;

        btnFinalizar.textContent =
            "Procesando inscripción...";


        // Recorre todas las actividades seleccionadas
        for(
            const actividad
            of actividadesSeleccionadas
        ){

            // Crea la inscripción utilizando el modelo
            const inscripcion =
                crearInscripcion(
                    participanteId,
                    actividad._id
                );


            // Envía la inscripción al backend.
            // El backend valida:
            // - participante existente
            // - actividad existente
            // - cupos
            // - duplicados
            // - conflictos de horario
            await registrarInscripcion(
                inscripcion
            );
        }


        // Si todas las inscripciones se registraron
        // correctamente, muestra mensaje de éxito
        Swal.fire({
            title: "Inscripción finalizada",
            text: "Las actividades fueron inscritas correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar"

        }).then(function(){

            // Elimina el identificador temporal
            // del participante
            sessionStorage.removeItem(
                "participanteId"
            );


            // Redirige a la siguiente pantalla
            window.location.href =
                "/pages/Inscripciones/inscripciones.html";
        });


    } catch(error){

        console.error(
            "Error al finalizar inscripción:",
            error
        );


        // Vuelve a habilitar el botón
        btnFinalizar.disabled = false;

        btnFinalizar.textContent =
            "Finalizar inscripción";


        Swal.fire({
            title: "No se pudo completar la inscripción",
            text: error.message,
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Evento del botón Finalizar
if(btnFinalizar){

    btnFinalizar.addEventListener(
        "click",
        finalizarInscripcionRetorno
    );
}


// Carga las actividades cuando abre la pantalla
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarActividadesRetorno();
    }
);