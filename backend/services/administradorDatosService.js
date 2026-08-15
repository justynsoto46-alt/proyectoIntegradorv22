/*
============================================================
SERVICIO DE ACCESO A DATOS DE ADMINISTRADORES
============================================================

Este archivo se comunica directamente con MongoDB.

Aquí se realizan las operaciones CRUD sobre la colección
"administradores".

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "administradores";

// Campos que nunca se devuelven al frontend
const PROYECCION = {
    projection: {
        contrasena: 0
    }
};


/*
Obtiene la colección de administradores.
*/
function obtenerColeccion(baseDatos){

    return baseDatos.collection(
        COLECCION
    );
}


/*
Inserta un nuevo administrador.
*/
async function crear(
    baseDatos,
    administrador
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.insertOne(
            administrador
        );

    // Agrega el id generado por MongoDB
    administrador._id =
        resultado.insertedId;

    return administrador;
}


/*
Obtiene todos los administradores.

La contraseña no se devuelve al frontend.
*/
async function listar(baseDatos){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const administradores =
        await coleccion
            .find(
                {},
                PROYECCION
            )
            .sort({
                fechaRegistro: -1
            })
            .toArray();

    return administradores;
}


/*
Obtiene un administrador por su identificador.

La contraseña no se devuelve.
*/
async function obtener(
    baseDatos,
    idAdministrador
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const administrador =
        await coleccion.findOne(
            {
                _id: new ObjectId(
                    idAdministrador
                )
            },
            PROYECCION
        );

    return administrador;
}


/*
Busca un administrador por correo.

En esta función sí se devuelve la contraseña porque
puede ser necesaria para procesos internos como
inicio de sesión o validaciones.
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
Modifica un administrador.
*/
async function modificar(
    baseDatos,
    idAdministrador,
    cambios
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.updateOne(
            {
                _id: new ObjectId(
                    idAdministrador
                )
            },
            {
                $set: cambios
            }
        );

    return resultado;
}


/*
Elimina un administrador.
*/
async function eliminar(
    baseDatos,
    idAdministrador
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.deleteOne({
            _id: new ObjectId(
                idAdministrador
            )
        });

    return resultado;
}


// Exporta las funciones de acceso a datos
module.exports = {
    crear,
    listar,
    obtener,
    obtenerPorCorreo,
    modificar,
    eliminar
};