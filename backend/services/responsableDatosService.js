/*
============================================================
SERVICIO DE ACCESO A DATOS DE RESPONSABLES
============================================================

Este archivo se comunica directamente con MongoDB.

Aquí se realizan las operaciones CRUD sobre la colección
"responsables".

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "responsables";


/*
Obtiene la colección de responsables.
*/
function obtenerColeccion(baseDatos){

    return baseDatos.collection(
        COLECCION
    );
}


/*
Inserta un nuevo responsable en MongoDB.
*/
async function crear(
    baseDatos,
    responsable
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.insertOne(
            responsable
        );

    // Agrega el _id generado por MongoDB
    responsable._id =
        resultado.insertedId;

    return responsable;
}


/*
Obtiene todos los responsables registrados.
*/
async function listar(baseDatos){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const responsables =
        await coleccion
            .find()
            .sort({
                fechaRegistro: -1
            })
            .toArray();

    return responsables;
}


/*
Obtiene un responsable por su identificador.
*/
async function obtener(
    baseDatos,
    idResponsable
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const responsable =
        await coleccion.findOne({
            _id: new ObjectId(
                idResponsable
            )
        });

    return responsable;
}


/*
Busca un responsable por su correo.
*/
async function obtenerPorCorreo(
    baseDatos,
    correo
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const responsable =
        await coleccion.findOne({
            correo: correo
        });

    return responsable;
}


/*
Modifica un responsable.
*/
async function modificar(
    baseDatos,
    idResponsable,
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
                    idResponsable
                )
            },
            {
                $set: cambios
            }
        );

    return resultado;
}


/*
Elimina un responsable.
*/
async function eliminar(
    baseDatos,
    idResponsable
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.deleteOne({
            _id: new ObjectId(
                idResponsable
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