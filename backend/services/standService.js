/*
============================================================
SERVICIO DE STANDS
============================================================

Este archivo contiene la lógica relacionada con stands.

Aquí NO se accede directamente a MongoDB.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Importa el servicio de acceso a datos
const standDatosService =
    require("./standDatosService");


/*
Valida que el identificador tenga formato ObjectId.
*/
function validarId(idStand){

    return ObjectId.isValid(
        idStand
    );
}


/*
Registra un stand.
*/
async function registrarStand(
    baseDatos,
    stand
){

    const standGuardado =
        await standDatosService.crear(
            baseDatos,
            stand
        );

    return standGuardado;
}


/*
Obtiene todos los stands.
*/
async function listarStands(
    baseDatos
){

    return await standDatosService.listar(
        baseDatos
    );
}


/*
Consulta un stand por su identificador.
*/
async function consultarStandPorId(
    baseDatos,
    idStand
){

    // Valida el identificador
    if(!validarId(idStand)){

        const error =
            new Error(
                "El identificador del stand no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Busca el stand
    const stand =
        await standDatosService.obtener(
            baseDatos,
            idStand
        );


    // Verifica que exista
    if(!stand){

        const error =
            new Error(
                "No se encontró el stand."
            );

        error.status = 404;

        throw error;
    }

    return stand;
}


/*
Modifica un stand.
*/
async function modificarStand(
    baseDatos,
    idStand,
    cambios
){

    // Valida el identificador
    if(!validarId(idStand)){

        const error =
            new Error(
                "El identificador del stand no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Verifica que el stand exista
    const stand =
        await standDatosService.obtener(
            baseDatos,
            idStand
        );


    if(!stand){

        const error =
            new Error(
                "No se encontró el stand."
            );

        error.status = 404;

        throw error;
    }


    // Realiza la modificación
    return await standDatosService.modificar(
        baseDatos,
        idStand,
        cambios
    );
}


/*
Elimina un stand.
*/
async function eliminarStand(
    baseDatos,
    idStand
){

    // Valida el identificador
    if(!validarId(idStand)){

        const error =
            new Error(
                "El identificador del stand no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Verifica que exista
    const stand =
        await standDatosService.obtener(
            baseDatos,
            idStand
        );


    if(!stand){

        const error =
            new Error(
                "No se encontró el stand."
            );

        error.status = 404;

        throw error;
    }


    // Elimina el stand
    return await standDatosService.eliminar(
        baseDatos,
        idStand
    );
}


// Exporta las funciones del servicio
module.exports = {
    registrarStand,
    listarStands,
    consultarStandPorId,
    modificarStand,
    eliminarStand
};