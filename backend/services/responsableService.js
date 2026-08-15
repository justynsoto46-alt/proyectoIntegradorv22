/*
============================================================
SERVICIO DE RESPONSABLES
============================================================

Este archivo contiene la lógica relacionada con responsables.

Aquí NO se accede directamente a MongoDB.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Importa el servicio de acceso a datos
const responsableDatosService =
    require("./responsableDatosService");


/*
Valida que el identificador tenga formato ObjectId.
*/
function validarId(idResponsable){

    return ObjectId.isValid(
        idResponsable
    );
}


/*
Registra un responsable.

Antes de guardar, verifica que el correo
no esté registrado previamente.
*/
async function registrarResponsable(
    baseDatos,
    responsable
){

    const responsableExistente =
        await responsableDatosService
            .obtenerPorCorreo(
                baseDatos,
                responsable.correo
            );

    if(responsableExistente){

        const error =
            new Error(
                "Ya existe un responsable registrado con este correo."
            );

        error.status = 409;

        throw error;
    }

    const responsableGuardado =
        await responsableDatosService
            .crear(
                baseDatos,
                responsable
            );

    return responsableGuardado;
}


/*
Obtiene todos los responsables.
*/
async function listarResponsables(
    baseDatos
){

    return await responsableDatosService
        .listar(
            baseDatos
        );
}


/*
Consulta un responsable por su identificador.
*/
async function consultarResponsablePorId(
    baseDatos,
    idResponsable
){

    if(!validarId(idResponsable)){

        const error =
            new Error(
                "El identificador del responsable no es válido."
            );

        error.status = 400;

        throw error;
    }

    const responsable =
        await responsableDatosService
            .obtener(
                baseDatos,
                idResponsable
            );

    if(!responsable){

        const error =
            new Error(
                "No se encontró el responsable."
            );

        error.status = 404;

        throw error;
    }

    return responsable;
}


/*
Modifica un responsable.
*/
async function modificarResponsable(
    baseDatos,
    idResponsable,
    cambios
){

    if(!validarId(idResponsable)){

        const error =
            new Error(
                "El identificador del responsable no es válido."
            );

        error.status = 400;

        throw error;
    }

    const responsable =
        await responsableDatosService
            .obtener(
                baseDatos,
                idResponsable
            );

    if(!responsable){

        const error =
            new Error(
                "No se encontró el responsable."
            );

        error.status = 404;

        throw error;
    }

    return await responsableDatosService
        .modificar(
            baseDatos,
            idResponsable,
            cambios
        );
}


/*
Elimina un responsable.
*/
async function eliminarResponsable(
    baseDatos,
    idResponsable
){

    if(!validarId(idResponsable)){

        const error =
            new Error(
                "El identificador del responsable no es válido."
            );

        error.status = 400;

        throw error;
    }

    const responsable =
        await responsableDatosService
            .obtener(
                baseDatos,
                idResponsable
            );

    if(!responsable){

        const error =
            new Error(
                "No se encontró el responsable."
            );

        error.status = 404;

        throw error;
    }

    return await responsableDatosService
        .eliminar(
            baseDatos,
            idResponsable
        );
}


// Exporta las funciones del servicio
module.exports = {
    registrarResponsable,
    listarResponsables,
    consultarResponsablePorId,
    modificarResponsable,
    eliminarResponsable
};
