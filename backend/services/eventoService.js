/*
============================================================
SERVICIO DE EVENTOS
============================================================

Este archivo contiene la lógica relacionada con eventos.

Aquí NO se accede directamente a MongoDB.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Importa el servicio de acceso a datos
const eventoDatosService =
    require("./eventoDatosService");


/*
Valida que el identificador tenga formato ObjectId.
*/
function validarId(idEvento){

    return ObjectId.isValid(
        idEvento
    );
}


/*
Registra un evento.
*/
async function registrarEvento(
    baseDatos,
    evento
){

    const eventoGuardado =
        await eventoDatosService.crear(
            baseDatos,
            evento
        );

    return eventoGuardado;
}


/*
Obtiene todos los eventos.
*/
async function listarEventos(
    baseDatos
){

    return await eventoDatosService.listar(
        baseDatos
    );
}


/*
Consulta un evento por su identificador.
*/
async function consultarEventoPorId(
    baseDatos,
    idEvento
){

    // Valida el identificador
    if(!validarId(idEvento)){

        const error =
            new Error(
                "El identificador del evento no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Busca el evento
    const evento =
        await eventoDatosService.obtener(
            baseDatos,
            idEvento
        );


    // Verifica que exista
    if(!evento){

        const error =
            new Error(
                "No se encontró el evento."
            );

        error.status = 404;

        throw error;
    }

    return evento;
}


/*
Modifica un evento.
*/
async function modificarEvento(
    baseDatos,
    idEvento,
    cambios
){

    // Valida el identificador
    if(!validarId(idEvento)){

        const error =
            new Error(
                "El identificador del evento no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Verifica que el evento exista
    const evento =
        await eventoDatosService.obtener(
            baseDatos,
            idEvento
        );


    if(!evento){

        const error =
            new Error(
                "No se encontró el evento."
            );

        error.status = 404;

        throw error;
    }


    // Realiza la modificación
    return await eventoDatosService.modificar(
        baseDatos,
        idEvento,
        cambios
    );
}


/*
Elimina un evento.
*/
async function eliminarEvento(
    baseDatos,
    idEvento
){

    // Valida el identificador
    if(!validarId(idEvento)){

        const error =
            new Error(
                "El identificador del evento no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Verifica que exista
    const evento =
        await eventoDatosService.obtener(
            baseDatos,
            idEvento
        );


    if(!evento){

        const error =
            new Error(
                "No se encontró el evento."
            );

        error.status = 404;

        throw error;
    }


    // Elimina el evento
    return await eventoDatosService.eliminar(
        baseDatos,
        idEvento
    );
}


// Exporta las funciones del servicio
module.exports = {
    registrarEvento,
    listarEventos,
    consultarEventoPorId,
    modificarEvento,
    eliminarEvento
};