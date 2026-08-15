/*
============================================================
SERVICIO DE ACTIVIDADES
============================================================

Este archivo contiene la lógica relacionada con actividades.

Aquí NO se accede directamente a MongoDB.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Importa el servicio de acceso a datos
const actividadDatosService =
    require("./actividadDatosService");


/*
Valida que el identificador tenga formato ObjectId.
*/
function validarId(idActividad){

    return ObjectId.isValid(
        idActividad
    );
}


/*
Registra una actividad.
*/
async function registrarActividad(
    baseDatos,
    actividad
){

    const actividadGuardada =
        await actividadDatosService.crear(
            baseDatos,
            actividad
        );

    return actividadGuardada;
}


/*
Obtiene todas las actividades.
*/
async function listarActividades(
    baseDatos
){

    return await actividadDatosService.listar(
        baseDatos
    );
}


/*
Consulta una actividad por su identificador.
*/
async function consultarActividadPorId(
    baseDatos,
    idActividad
){

    // Valida el identificador
    if(!validarId(idActividad)){

        const error =
            new Error(
                "El identificador de la actividad no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Busca la actividad
    const actividad =
        await actividadDatosService.obtener(
            baseDatos,
            idActividad
        );


    // Verifica que exista
    if(!actividad){

        const error =
            new Error(
                "No se encontró la actividad."
            );

        error.status = 404;

        throw error;
    }

    return actividad;
}


/*
Modifica una actividad.
*/
async function modificarActividad(
    baseDatos,
    idActividad,
    cambios
){

    // Valida el identificador
    if(!validarId(idActividad)){

        const error =
            new Error(
                "El identificador de la actividad no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Verifica que la actividad exista
    const actividad =
        await actividadDatosService.obtener(
            baseDatos,
            idActividad
        );


    if(!actividad){

        const error =
            new Error(
                "No se encontró la actividad."
            );

        error.status = 404;

        throw error;
    }


    // Realiza la modificación
    return await actividadDatosService.modificar(
        baseDatos,
        idActividad,
        cambios
    );
}


/*
Elimina una actividad.
*/
async function eliminarActividad(
    baseDatos,
    idActividad
){

    // Valida el identificador
    if(!validarId(idActividad)){

        const error =
            new Error(
                "El identificador de la actividad no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Verifica que exista
    const actividad =
        await actividadDatosService.obtener(
            baseDatos,
            idActividad
        );


    if(!actividad){

        const error =
            new Error(
                "No se encontró la actividad."
            );

        error.status = 404;

        throw error;
    }


    // Elimina la actividad
    return await actividadDatosService.eliminar(
        baseDatos,
        idActividad
    );
}


// Exporta las funciones del servicio
module.exports = {
    registrarActividad,
    listarActividades,
    consultarActividadPorId,
    modificarActividad,
    eliminarActividad
};