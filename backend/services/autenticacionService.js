/*
============================================================
SERVICIO DE AUTENTICACIÓN
============================================================

Este archivo contiene la lógica necesaria
para iniciar sesión.

Aquí NO se accede directamente a MongoDB.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

// Importa el servicio de acceso a datos
const autenticacionDatosService =
    require("./autenticacionDatosService");


/*
Valida las credenciales de un administrador.
*/
async function iniciarSesion(
    baseDatos,
    correo,
    contrasena
){

    // Busca el administrador por correo
    const administrador =
        await autenticacionDatosService
            .obtenerPorCorreo(
                baseDatos,
                correo
            );


    // Verifica que exista un administrador
    // con el correo indicado
    if(!administrador){

        const error =
            new Error(
                "El correo o la contraseña no son válidos."
            );

        error.status = 401;

        throw error;
    }


    // Verifica que la contraseña coincida
    if(administrador.contrasena !== contrasena){

        const error =
            new Error(
                "El correo o la contraseña no son válidos."
            );

        error.status = 401;

        throw error;
    }


    // Devuelve el administrador autenticado
    return administrador;
}


// Exporta las funciones del servicio
module.exports = {
    iniciarSesion
};