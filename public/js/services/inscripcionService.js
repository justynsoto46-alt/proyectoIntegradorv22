// Importa las funciones genéricas para comunicarse con el backend
import {
    crearDatos,
    obtenerDatos,
    eliminarDatos
} from "../comunes/api.js";


// Dirección base de la API de inscripciones
const URL_INSCRIPCIONES =
    "/api/inscripciones";


/*
Registra una inscripción.
*/
export async function registrarInscripcion(
    inscripcion
){

    return await crearDatos(
        URL_INSCRIPCIONES,
        inscripcion.obtenerDatosParaGuardar()
    );
}


/*
Obtiene las inscripciones de un participante
utilizando su identificador de MongoDB.
*/
export async function obtenerInscripcionesParticipante(
    participanteId
){

    return await obtenerDatos(
        `${URL_INSCRIPCIONES}/participante/${participanteId}`
    );
}


/*
Busca un participante por su número de identificación
y obtiene todas sus inscripciones.
*/
export async function obtenerInscripcionesPorIdentificacion(
    identificacion
){

    return await obtenerDatos(
        `${URL_INSCRIPCIONES}/identificacion/${identificacion}`
    );
}


/*
Cancela una inscripción.
*/
export async function cancelarInscripcion(
    idInscripcion
){

    return await eliminarDatos(
        `${URL_INSCRIPCIONES}/${idInscripcion}`
    );
}

// Obtiene los participantes inscritos
// en una actividad
export async function obtenerInscripcionesPorActividad(
    actividadId
){

    return await obtenerDatos(
        `${URL_INSCRIPCIONES}/actividad/${actividadId}`
    );
}