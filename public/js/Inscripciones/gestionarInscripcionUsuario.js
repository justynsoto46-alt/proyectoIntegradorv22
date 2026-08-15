// Importa las funciones del servicio de inscripciones
import {
    obtenerInscripcionesPorIdentificacion,
    cancelarInscripcion
} from "../services/inscripcionService.js";


// Se obtienen los elementos necesarios para gestionar
// las inscripciones del participante
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


// Guarda temporalmente el participante encontrado
let participanteActual = null;


// Oculta los elementos al cargar la página
contenedorInscripciones.style.display =
    "none";

mensajeSinInscripciones.style.display =
    "none";

btnAgregarActividades.style.display =
    "none";



/*
Valida la identificación ingresada.
*/
function validarIdentificacion(){

    let error = false;

    const identificacion =
        inputCedula.value.trim();


    // Verifica que no esté vacía
    if(identificacion === ""){

        error = true;
    }


    // Debe contener únicamente números
    if(!/^\d+$/.test(identificacion)){

        error = true;
    }


    // Debe contener entre 9 y 15 dígitos
    if(
        identificacion.length < 9 ||
        identificacion.length > 15
    ){

        error = true;
    }


    if(error){

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
Crea las tarjetas con las inscripciones
obtenidas desde MongoDB.
*/
function mostrarInscripcionesRetorno(
    inscripciones
){

    // Limpia las tarjetas anteriores
    contenedorInscripciones.innerHTML =
        "";


    // Verifica si existen inscripciones
    if(inscripciones.length === 0){

        contenedorInscripciones.style.display =
            "none";

        mensajeSinInscripciones.style.display =
            "block";

        return;
    }


    // Oculta mensaje de vacío
    mensajeSinInscripciones.style.display =
        "none";


    // Muestra el contenedor
    contenedorInscripciones.style.display =
        "block";


    // Recorre las inscripciones
    inscripciones.forEach(
        function(inscripcion){

            // Crea una tarjeta
            const tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.classList.add(
                "tarjeta-inscripcion"
            );


            // Guarda el id de la inscripción
            tarjeta.dataset.id =
                inscripcion.idInscripcion;


            // Crea el contenido
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
                    data-id="${inscripcion.idInscripcion}"
                >
                    Cancelar inscripción
                </button>
            `;


            // Obtiene el botón recién creado
            const botonCancelar =
                tarjeta.querySelector(
                    ".boton-cancelar"
                );


            // Agrega el evento
            botonCancelar.addEventListener(
                "click",
                function(){

                    cancelarInscripcionRetorno(
                        inscripcion.idInscripcion
                    );
                }
            );


            // Agrega la tarjeta
            contenedorInscripciones.appendChild(
                tarjeta
            );
        }
    );
}



/*
Busca las inscripciones del participante
utilizando su identificación.
*/
async function buscarInscripcionesRetorno(){

    // Valida la identificación
    if(!validarIdentificacion()){

        return;
    }


    const identificacion =
        inputCedula.value.trim();


    try{

        // Consulta al backend
        const resultado =
            await obtenerInscripcionesPorIdentificacion(
                identificacion
            );


        // Guarda temporalmente
        // el participante encontrado
        participanteActual =
            resultado.participante;


        // Guarda su id para permitir
        // agregar más actividades después
        sessionStorage.setItem(
            "participanteId",
            participanteActual._id
        );


        // Muestra las inscripciones
        mostrarInscripcionesRetorno(
            resultado.inscripciones
        );


        // Muestra el botón para agregar
        // nuevas actividades
        btnAgregarActividades.style.display =
            "inline-block";


        Swal.fire({
            title: "Participante encontrado",
            text:
                `Inscripciones de ${participanteActual.nombreCompleto}.`,
            icon: "success",
            confirmButtonText: "Aceptar"
        });


    } catch(error){

        console.error(
            "Error al buscar inscripciones:",
            error
        );


        participanteActual = null;


        // Limpia resultados anteriores
        contenedorInscripciones.innerHTML =
            "";

        contenedorInscripciones.style.display =
            "none";

        btnAgregarActividades.style.display =
            "none";


        mensajeSinInscripciones.style.display =
            "block";

        mensajeSinInscripciones.textContent =
            error.message;


        Swal.fire({
            title: "No se encontraron inscripciones",
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

                // Solicita al backend
                // eliminar la inscripción
                await cancelarInscripcion(
                    idInscripcion
                );


                Swal.fire({
                    title:
                        "Inscripción cancelada",
                    text:
                        "La inscripción fue cancelada correctamente y el cupo quedó disponible nuevamente.",
                    icon: "success",
                    confirmButtonText:
                        "Aceptar"
                });


                // Vuelve a consultar para actualizar
                // las tarjetas mostradas
                buscarInscripcionesRetorno();


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
Redirige a la pantalla para seleccionar
más actividades.
*/
function agregarActividadesRetorno(){

    // Verifica que exista
    // un participante seleccionado
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


    // El participanteId ya quedó
    // guardado en sessionStorage
    window.location.href =
        "/pages/Actividad/seleccionarActividades.html";
}


// Evento para buscar inscripciones
if(btnBuscarInscripciones){

    btnBuscarInscripciones.addEventListener(
        "click",
        buscarInscripcionesRetorno
    );
}


// Evento para agregar más actividades
if(btnAgregarActividades){

    btnAgregarActividades.addEventListener(
        "click",
        agregarActividadesRetorno
    );
}