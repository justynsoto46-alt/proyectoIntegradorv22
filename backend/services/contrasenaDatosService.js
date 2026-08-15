/*
============================================================
SERVICIO DE ACCESO A DATOS DE CONTRASEÑA
============================================================

Este archivo se comunica directamente con MongoDB.

Aquí se realizan las consultas necesarias para
buscar al administrador y actualizar su contraseña.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

// Nombre de la colección
const COLECCION = "administradores";


/*
Obtiene la colección de administradores.
*/
function obtenerColeccion(baseDatos){

    return baseDatos.collection(
        COLECCION
    );
}


/*
Busca un administrador por su correo.
*/
async function obtenerPorCorreo(
    baseDatos,
    correo
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const administrador =
        await coleccion.findOne({
            correo: correo
        });

    return administrador;
}


/*
Actualiza la contraseña de un administrador.
*/
async function modificarContrasena(
    baseDatos,
    correo,
    nuevaContrasena
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.updateOne(
            {
                correo: correo
            },
            {
                $set: {
                    contrasena: nuevaContrasena,
                    fechaModificacion: new Date()
                }
            }
        );

    return resultado;
}


// Exporta las funciones de acceso a datos
module.exports = {
    obtenerPorCorreo,
    modificarContrasena
};