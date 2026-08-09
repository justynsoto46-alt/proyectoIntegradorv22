// Importa la función genérica para enviar datos al backend
import {
    crearDatos,
    obtenerDatos,
    actualizarDatos,
    eliminarDatos
} from "../comunes/api.js";

// Dirección base de la API de participantes
const URL_PARTICIPANTES = "/api/participantes";


// Función para registrar un participante
export async function registrarParticipante(participante){

    // Obtiene únicamente los datos necesarios para guardar
    const datosParticipante =
        participante.obtenerDatosParaGuardar();

    // Envía los datos al backend utilizando la función genérica
    const resultado = await crearDatos(
        URL_PARTICIPANTES,
        datosParticipante
    );

    // Devuelve la respuesta recibida
    return resultado;
}

// Función para obtener todos los participantes
export async function obtenerParticipantes(){

    // Solicita la lista de participantes al backend
    const participantes =
        await obtenerDatos("/api/participantes");

    return participantes;
}


// Función para eliminar un participante
export async function eliminarParticipante(idParticipante){

    // Solicita al backend eliminar el participante indicado
    const datosRespuesta =
        await eliminarDatos(
            `/api/participantes/${idParticipante}`
        );

    return datosRespuesta;
}

// Función para obtener un participante por su identificador
export async function obtenerParticipantePorId(idParticipante){

    // Solicita al backend la información del participante
    const participante =
        await obtenerDatos(
            `${URL_PARTICIPANTES}/${idParticipante}`
        );

    return participante;
}


// Función para modificar un participante
export async function modificarParticipante(
    idParticipante,
    participante
){

    // Obtiene únicamente los datos permitidos para modificar
    const datosParticipante =
        participante.obtenerDatosParaModificar();

    // Envía los cambios al backend
    const resultado =
        await actualizarDatos(
            `${URL_PARTICIPANTES}/${idParticipante}`,
            datosParticipante
        );

    return resultado;
}