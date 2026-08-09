// Importa las funciones genéricas para comunicarse con el backend
import {
    crearDatos,
    obtenerDatos,
    eliminarDatos
} from "../comunes/api.js";

// Dirección base de la API de inscripciones
const URL_INSCRIPCIONES =
    "/api/inscripciones";


// Función para registrar una inscripción
export async function registrarInscripcion(
    inscripcion
){

    return await crearDatos(
        URL_INSCRIPCIONES,
        inscripcion.obtenerDatosParaGuardar()
    );
}


// Función para consultar las inscripciones
// de un participante
export async function obtenerInscripcionesParticipante(
    participanteId
){

    return await obtenerDatos(
        `${URL_INSCRIPCIONES}/participante/${participanteId}`
    );
}


// Función para cancelar una inscripción
export async function cancelarInscripcion(
    idInscripcion
){

    return await eliminarDatos(
        `${URL_INSCRIPCIONES}/${idInscripcion}`
    );
}