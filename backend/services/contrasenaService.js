/*
============================================================
SERVICIO DE CONTRASEÑA
============================================================

Este archivo contiene la lógica necesaria
para modificar la contraseña de un administrador.

Aquí NO se accede directamente a MongoDB.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/


// Importa el servicio de acceso a datos
const contrasenaDatosService =
    require("./contrasenaDatosService");


/*
Modifica la contraseña de un administrador.

Antes de modificar verifica que exista
un administrador registrado con el correo indicado.
*/
async function modificarContrasena(
    baseDatos,
    correo,
    nuevaContrasena
){

    // Busca el administrador por correo
    const administrador =
        await contrasenaDatosService
            .obtenerPorCorreo(
                baseDatos,
                correo
            );


    // Verifica que el administrador exista
    if(!administrador){

        const error =
            new Error(
                "No existe un administrador registrado con este correo."
            );

        error.status = 404;

        throw error;
    }


    // Verifica que la nueva contraseña
    // no sea igual a la contraseña actual
    if(
        administrador.contrasena ===
        nuevaContrasena
    ){

        const error =
            new Error(
                "La nueva contraseña debe ser diferente de la contraseña actual."
            );

        error.status = 400;

        throw error;
    }


    // Solicita al DatosService actualizar la contraseña
    const resultado =
        await contrasenaDatosService
            .modificarContrasena(
                baseDatos,
                correo,
                nuevaContrasena
            );


    return resultado;
}


// Exporta las funciones del servicio
module.exports = {
    modificarContrasena
};