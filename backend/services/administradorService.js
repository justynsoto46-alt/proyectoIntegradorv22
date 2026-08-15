/*
============================================================
SERVICIO DE ADMINISTRADORES
============================================================

Este archivo contiene la lógica relacionada con
los administradores.

Aquí NO se accede directamente a MongoDB.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Importa el servicio de acceso a datos
const administradorDatosService =
    require("./administradorDatosService");


/*
Valida que el identificador tenga formato ObjectId.
*/
function validarId(idAdministrador){

    return ObjectId.isValid(
        idAdministrador
    );
}


/*
Registra un administrador.

Antes de guardar verifica que el correo
no esté registrado previamente.
*/
async function registrarAdministrador(
    baseDatos,
    administrador
){

    const administradorExistente =
        await administradorDatosService
            .obtenerPorCorreo(
                baseDatos,
                administrador.correo
            );

    if(administradorExistente){

        const error =
            new Error(
                "Ya existe un administrador registrado con este correo."
            );

        error.status = 409;

        throw error;
    }

    const administradorGuardado =
        await administradorDatosService
            .crear(
                baseDatos,
                administrador
            );

    return administradorGuardado;
}


/*
Obtiene todos los administradores.
*/
async function listarAdministradores(
    baseDatos
){

    return await administradorDatosService
        .listar(
            baseDatos
        );
}


/*
Consulta un administrador por su identificador.
*/
async function consultarAdministradorPorId(
    baseDatos,
    idAdministrador
){

    if(!validarId(idAdministrador)){

        const error =
            new Error(
                "El identificador del administrador no es válido."
            );

        error.status = 400;

        throw error;
    }

    const administrador =
        await administradorDatosService
            .obtener(
                baseDatos,
                idAdministrador
            );

    if(!administrador){

        const error =
            new Error(
                "No se encontró el administrador."
            );

        error.status = 404;

        throw error;
    }

    return administrador;
}


/*
Modifica un administrador.

Antes de modificar verifica:
- que el identificador sea válido
- que el administrador exista
- que el nuevo correo no pertenezca a otro administrador
*/
async function modificarAdministrador(
    baseDatos,
    idAdministrador,
    cambios
){

    // Valida el identificador
    if(!validarId(idAdministrador)){

        const error =
            new Error(
                "El identificador del administrador no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Busca el administrador que se desea modificar
    const administrador =
        await administradorDatosService.obtener(
            baseDatos,
            idAdministrador
        );


    // Verifica que exista
    if(!administrador){

        const error =
            new Error(
                "No se encontró el administrador."
            );

        error.status = 404;

        throw error;
    }


    // Busca si existe otro administrador
    // con el correo que se desea guardar
    const administradorConCorreo =
        await administradorDatosService
            .obtenerPorCorreo(
                baseDatos,
                cambios.correo
            );


    // Si existe un administrador con ese correo,
    // verifica que no sea el mismo que estamos modificando
    if(
        administradorConCorreo &&
        administradorConCorreo._id.toString()
            !== idAdministrador
    ){

        const error =
            new Error(
                "Ya existe un administrador registrado con este correo."
            );

        error.status = 409;

        throw error;
    }


    // Realiza la modificación
    return await administradorDatosService.modificar(
        baseDatos,
        idAdministrador,
        cambios
    );
}


/*
Elimina un administrador.
*/
async function eliminarAdministrador(
    baseDatos,
    idAdministrador
){

    if(!validarId(idAdministrador)){

        const error =
            new Error(
                "El identificador del administrador no es válido."
            );

        error.status = 400;

        throw error;
    }

    const administrador =
        await administradorDatosService
            .obtener(
                baseDatos,
                idAdministrador
            );

    if(!administrador){

        const error =
            new Error(
                "No se encontró el administrador."
            );

        error.status = 404;

        throw error;
    }

    return await administradorDatosService
        .eliminar(
            baseDatos,
            idAdministrador
        );
}


// Exporta las funciones del servicio
module.exports = {
    registrarAdministrador,
    listarAdministradores,
    consultarAdministradorPorId,
    modificarAdministrador,
    eliminarAdministrador
};
