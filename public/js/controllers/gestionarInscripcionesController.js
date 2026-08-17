// Importa las funciones necesarias
// del servicio de inscripciones
import {
    obtenerInscripcionesPorIdentificacion,
    cancelarInscripcion
} from "../services/inscripcionService.js";


// Obtiene los elementos necesarios de la página
const inputCedula =
    document.getElementById("cedula");

const btnBuscarInscripciones =
    document.getElementById(
        "btnBuscarInscripciones"
    );

const contenedorInscripciones =
    document.getElementById(
        "contenedorInscripciones"
    );

const mensajeSinInscripciones =
    document.getElementById(
        "mensajeSinInscripciones"
    );

const btnAgregarActividades =
    document.getElementById(
        "btnAgregarActividades"
    );


// Guarda temporalmente el participante
// que fue encontrado por identificación
let participanteActual = null;


// Oculta los resultados al cargar la página
contenedorInscripciones.style.display =
    "none";

mensajeSinInscripciones.style.display =
    "none";

btnAgregarActividades.style.display =
    "none";


/*
Valida el número de identificación.
*/
function validarIdentificacion(){

    const identificacion =
        inputCedula.value.trim();


    // Debe contener únicamente números
    // y entre 9 y 15 dígitos
    const identificacionValida =
        /^\d{9,15}$/.test(
            identificacion
        );


    if(!identificacionValida){

        inputCedula.classList.add(
            "input-error"
        );

        Swal.fire({
            title: "Identificación inválida",
            text:
                "Ingrese una identificación válida. Debe contener solo números y tener entre 9 y 15 dígitos.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        return false;
    }


    inputCedula.classList.remove(
        "input-error"
    );

    return true;
}


/*
Crea las tarjetas correspondientes
a las inscripciones encontradas.
*/
function mostrarInscripcionesRetorno(
    inscripciones
){

    // Limpia resultados anteriores
    contenedorInscripciones.innerHTML =
        "";


    // Si el participante existe,
    // pero todavía no tiene inscripciones
    if(inscripciones.length === 0){

        contenedorInscripciones.style.display =
            "none";

        mensajeSinInscripciones.textContent =
            "El participante no tiene actividades inscritas.";

        mensajeSinInscripciones.style.display =
            "block";

        return;
    }


    mensajeSinInscripciones.style.display =
        "none";

    contenedorInscripciones.style.display =
        "block";


    // Crea una tarjeta por cada inscripción
    inscripciones.forEach(
        function(inscripcion){

            const tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.classList.add(
                "tarjeta-inscripcion"
            );


            tarjeta.innerHTML = `

                <h3>
                    ${inscripcion.nombreActividad || ""}
                </h3>

                <p>
                    <strong>Evento:</strong>
                    ${inscripcion.eventoAsociado || ""}
                </p>

                <p>
                    <strong>Fecha:</strong>
                    ${inscripcion.fecha || ""}
                </p>

                <p>
                    <strong>Horario:</strong>
                    ${inscripcion.horaInicio || ""}
                    -
                    ${inscripcion.horaFin || ""}
                </p>

                <p>
                    <strong>Ubicación:</strong>
                    ${inscripcion.ubicacion || ""}
                </p>

                <p>
                    <strong>Responsable:</strong>
                    ${inscripcion.responsable || ""}
                </p>

                <p>
                    <strong>Estado:</strong>
                    ${inscripcion.estado || ""}
                </p>

                <button
                    type="button"
                    class="boton-cancelar"
                    data-id="${inscripcion.idInscripcion}">
                    Cancelar inscripción
                </button>
            `;


            // Obtiene el botón recién creado
            const botonCancelar =
                tarjeta.querySelector(
                    ".boton-cancelar"
                );


            // Agrega el evento para cancelar
            botonCancelar.addEventListener(
                "click",
                function(){

                    cancelarInscripcionRetorno(
                        inscripcion.idInscripcion
                    );
                }
            );


            contenedorInscripciones.appendChild(
                tarjeta
            );
        }
    );
}


/*
Busca un participante por su identificación
y carga todas sus inscripciones.
*/
async function buscarInscripcionesRetorno(){

    // Primero valida la identificación
    if(!validarIdentificacion()){

        return;
    }


    const identificacion =
        inputCedula.value.trim();


    try{

        // Consulta el backend
        const resultado =
            await obtenerInscripcionesPorIdentificacion(
                identificacion
            );


        // Guarda el participante encontrado
        participanteActual =
            resultado.participante;


        // Guarda su id temporalmente.
        // Esto permite agregarle nuevas actividades.
        sessionStorage.setItem(
            "participanteId",
            participanteActual._id
        );


        // Muestra las inscripciones
        mostrarInscripcionesRetorno(
            resultado.inscripciones
        );


        // Permite agregar nuevas actividades
        btnAgregarActividades.style.display =
            "inline-block";


        Swal.fire({
            title: "Participante encontrado",
            text:
                `Se cargaron las inscripciones de ${participanteActual.nombreCompleto}.`,
            icon: "success",
            confirmButtonText: "Aceptar"
        });


    } catch(error){

        console.error(
            "Error al buscar inscripciones:",
            error
        );


        participanteActual = null;

        sessionStorage.removeItem(
            "participanteId"
        );


        contenedorInscripciones.innerHTML =
            "";

        contenedorInscripciones.style.display =
            "none";

        btnAgregarActividades.style.display =
            "none";


        mensajeSinInscripciones.textContent =
            error.message;

        mensajeSinInscripciones.style.display =
            "block";


        Swal.fire({
            title: "Participante no encontrado",
            text: error.message,
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}


/*
Cancela una inscripción.
*/
function cancelarInscripcionRetorno(
    idInscripcion
){

    Swal.fire({
        title: "¿Cancelar inscripción?",
        text:
            "Esta acción cancelará su participación en la actividad seleccionada.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No cancelar"

    }).then(
        async function(resultado){

            if(!resultado.isConfirmed){

                return;
            }


            try{

                // Cancela la inscripción en MongoDB.
                // El backend también devuelve el cupo.
                await cancelarInscripcion(
                    idInscripcion
                );


                await Swal.fire({
                    title:
                        "Inscripción cancelada",
                    text:
                        "La inscripción fue cancelada correctamente y el cupo quedó disponible nuevamente.",
                    icon: "success",
                    confirmButtonText:
                        "Aceptar"
                });


                // Consulta otra vez las inscripciones
                // para refrescar la pantalla
                await buscarInscripcionesRetorno();


            } catch(error){

                console.error(
                    "Error al cancelar inscripción:",
                    error
                );


                Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error",
                    confirmButtonText:
                        "Aceptar"
                });
            }
        }
    );
}


/*
Permite agregar nuevas actividades
al participante encontrado.
*/
function agregarActividadesRetorno(){

    if(!participanteActual){

        Swal.fire({
            title:
                "Participante no seleccionado",
            text:
                "Primero debe buscar un participante.",
            icon:
                "warning",
            confirmButtonText:
                "Aceptar"
        });

        return;
    }


    // El participanteId ya está guardado
    // en sessionStorage
    window.location.href =
        "/pages/Actividad/seleccionarActividades.html";
}


// Evento para buscar al participante
if(btnBuscarInscripciones){

    btnBuscarInscripciones.addEventListener(
        "click",
        buscarInscripcionesRetorno
    );
}


// Permite buscar también presionando Enter
if(inputCedula){

    inputCedula.addEventListener(
        "keydown",
        function(evento){

            if(evento.key === "Enter"){

                evento.preventDefault();

                buscarInscripcionesRetorno();
            }
        }
    );
}


// Evento para agregar actividades
if(btnAgregarActividades){

    btnAgregarActividades.addEventListener(
        "click",
        agregarActividadesRetorno
    );
}