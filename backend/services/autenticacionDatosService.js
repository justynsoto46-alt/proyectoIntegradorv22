/*
============================================================
SERVICIO DE ACCESO A DATOS DE AUTENTICACIÓN
============================================================

Este archivo se comunica directamente con MongoDB.

Aquí se realizan las consultas necesarias para
el proceso de inicio de sesión.

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

Se devuelve el documento completo porque durante
la autenticación sí necesitamos consultar la contraseña.
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


// Exporta las funciones de acceso a datos
module.exports = {
    obtenerPorCorreo
};