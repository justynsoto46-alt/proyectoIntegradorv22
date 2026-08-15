/*
============================================================
SERVICIO DE PARTICIPANTES
============================================================

Este archivo contiene la lógica relacionada con participantes.

Aquí NO se trabaja directamente con MongoDB.
Para consultar o modificar datos se utiliza
participanteDatosService.js.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Importa las funciones de acceso a datos
const participanteDatosService =
    require("./participanteDatosService");


/*
Valida que el identificador de MongoDB tenga
un formato correcto.
*/
function validarId(idParticipante){

    return ObjectId.isValid(idParticipante);
}


/*
Registra un participante.

Antes de guardar verifica que la identificación
no esté registrada previamente.
*/
async function registrarParticipante(
    baseDatos,
    participante
){

    // Busca si ya existe un participante
    // con la misma identificación
    const participanteExistente =
        await participanteDatosService
            .obtenerPorIdentificacion(
                baseDatos,
                participante.identificacion
            );

    // Si existe, genera un error
    if(participanteExistente){

        const error =
            new Error(
                "Ya existe un participante con esta identificación."
            );

        error.status = 409;

        throw error;
    }

    // Guarda el participante
    const participanteGuardado =
        await participanteDatosService.crear(
            baseDatos,
            participante
        );

    return participanteGuardado;
}


/*
Obtiene todos los participantes registrados.
*/
async function listarParticipantes(baseDatos){

    const participantes =
        await participanteDatosService.listar(
            baseDatos
        );

    return participantes;
}


/*
Obtiene un participante por su identificador.
*/
async function consultarParticipantePorId(
    baseDatos,
    idParticipante
){

    // Valida el formato del identificador
    if(!validarId(idParticipante)){

        const error =
            new Error(
                "El identificador del participante no es válido."
            );

        error.status = 400;

        throw error;
    }

    // Busca el participante
    const participante =
        await participanteDatosService.obtener(
            baseDatos,
            idParticipante
        );

    // Verifica que exista
    if(!participante){

        const error =
            new Error(
                "No se encontró el participante."
            );

        error.status = 404;

        throw error;
    }

    return participante;
}


/*
Modifica un participante.
*/
async function modificarParticipante(
    baseDatos,
    idParticipante,
    cambios
){

    // Valida el identificador
    if(!validarId(idParticipante)){

        const error =
            new Error(
                "El identificador del participante no es válido."
            );

        error.status = 400;

        throw error;
    }

    // Verifica que el participante exista
    const participante =
        await participanteDatosService.obtener(
            baseDatos,
            idParticipante
        );

    if(!participante){

        const error =
            new Error(
                "No se encontró el participante."
            );

        error.status = 404;

        throw error;
    }

    // Realiza la modificación
    const resultado =
        await participanteDatosService.modificar(
            baseDatos,
            idParticipante,
            cambios
        );

    return resultado;
}


/*
Elimina un participante.
*/
async function eliminarParticipante(
    baseDatos,
    idParticipante
){

    // Valida el identificador
    if(!validarId(idParticipante)){

        const error =
            new Error(
                "El identificador del participante no es válido."
            );

        error.status = 400;

        throw error;
    }

    // Verifica que exista
    const participante =
        await participanteDatosService.obtener(
            baseDatos,
            idParticipante
        );

    if(!participante){

        const error =
            new Error(
                "No se encontró el participante."
            );

        error.status = 404;

        throw error;
    }

    // Elimina el participante
    const resultado =
        await participanteDatosService.eliminar(
            baseDatos,
            idParticipante
        );

    return resultado;
}


// Exporta las funciones del servicio
module.exports = {
    registrarParticipante,
    listarParticipantes,
    consultarParticipantePorId,
    modificarParticipante,
    eliminarParticipante
};