// Importa el servicio de actividades
import {
    obtenerActividades
} from "../services/actividadService.js";


// Importa el servicio de inscripciones
import {
    obtenerInscripcionesPorActividad
} from "../services/inscripcionService.js";


// Obtiene los elementos de la pantalla
const selectActividad =
    document.getElementById("actividad");

const btnConsultar =
    document.getElementById("btnConsultar");

const tablaParticipantes =
    document.getElementById("tablaParticipantes");

const cuerpoTablaParticipantes =
    document.getElementById(
        "cuerpoTablaParticipantes"
    );

const mensajeSinParticipantes =
    document.getElementById(
        "mensajeSinParticipantes"
    );


/*
Carga las actividades registradas
en MongoDB dentro del select.
*/
async function cargarActividadesRetorno(){

    try{

        // Obtiene las actividades
        // mediante el service
        const actividades =
            await obtenerActividades();


        // Limpia las opciones anteriores
        selectActividad.innerHTML =
            '<option value="">Seleccione una actividad</option>';


        // Recorre las actividades
        actividades.forEach(
            function(actividad){

                // Crea una opción nueva
                const opcion =
                    document.createElement(
                        "option"
                    );


                // Guarda el _id de la actividad
                // como valor de la opción
                opcion.value =
                    actividad._id;


                // Muestra el nombre de la actividad
                opcion.textContent =
                    actividad.nombreActividad;


                // Agrega la opción al select
                selectActividad.appendChild(
                    opcion
                );
            }
        );

    } catch(error){

        console.error(
            "Error al cargar actividades:",
            error
        );


        Swal.fire({
            title:
                "Error al cargar actividades",
            text:
                "No fue posible obtener las actividades.",
            icon:
                "error",
            confirmButtonText:
                "Aceptar"
        });
    }
}


/*
Crea las filas de la tabla
con los participantes encontrados.
*/
function mostrarParticipantesRetorno(
    participantes
){

    // Limpia resultados anteriores
    cuerpoTablaParticipantes.innerHTML =
        "";


    // Verifica si existen participantes
    if(participantes.length === 0){

        // Oculta la tabla
        tablaParticipantes.style.display =
            "none";


        // Muestra el mensaje
        mensajeSinParticipantes.style.display =
            "block";

        mensajeSinParticipantes.textContent =
            "No hay participantes inscritos en esta actividad.";

        return;
    }


    // Oculta el mensaje
    mensajeSinParticipantes.style.display =
        "none";


    // Muestra la tabla
    tablaParticipantes.style.display =
        "table";


    // Recorre los participantes
    participantes.forEach(
        function(participante){

            // Crea una fila
            const fila =
                document.createElement(
                    "tr"
                );


            // Agrega la información
            fila.innerHTML = `

                <td>
                    ${participante.nombreCompleto || ""}
                </td>

                <td>
                    ${participante.identificacion || ""}
                </td>

                <td>
                    ${participante.correoElectronico || ""}
                </td>

                <td>
                    ${participante.telefono || ""}
                </td>

                <td>
                    ${participante.profesion || ""}
                </td>
            `;


            // Agrega la fila a la tabla
            cuerpoTablaParticipantes.appendChild(
                fila
            );
        }
    );
}


/*
Consulta los participantes inscritos
en la actividad seleccionada.
*/
async function consultarParticipantesRetorno(){

    // Obtiene el identificador
    // de la actividad seleccionada
    const actividadId =
        selectActividad.value;


    // Verifica que se haya elegido
    // una actividad
    if(actividadId === ""){

        tablaParticipantes.style.display =
            "none";

        mensajeSinParticipantes.style.display =
            "none";


        Swal.fire({
            title:
                "Actividad no seleccionada",
            text:
                "Seleccione una actividad para realizar la consulta.",
            icon:
                "warning",
            confirmButtonText:
                "Aceptar"
        });

        return;
    }


    try{

        // Consulta el backend
        const resultado =
            await obtenerInscripcionesPorActividad(
                actividadId
            );


        // Muestra los participantes
        mostrarParticipantesRetorno(
            resultado.participantes
        );


    } catch(error){

        console.error(
            "Error al consultar participantes:",
            error
        );


        tablaParticipantes.style.display =
            "none";

        mensajeSinParticipantes.style.display =
            "block";

        mensajeSinParticipantes.textContent =
            error.message;


        Swal.fire({
            title:
                "Error al consultar participantes",
            text:
                error.message,
            icon:
                "error",
            confirmButtonText:
                "Aceptar"
        });
    }
}


/*
Evento del botón Consultar.
*/
if(btnConsultar){

    btnConsultar.addEventListener(
        "click",
        consultarParticipantesRetorno
    );
}


/*
Carga las actividades cuando
se abre la pantalla.
*/
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarActividadesRetorno();
    }
);