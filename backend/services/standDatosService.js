/*
============================================================
SERVICIO DE ACCESO A DATOS DE STANDS
============================================================

Este archivo se comunica directamente con MongoDB.

Aquí se realizan las operaciones CRUD sobre la colección
"stands".

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "stands";


/*
Obtiene la colección de stands.
*/
function obtenerColeccion(baseDatos){

    return baseDatos.collection(
        COLECCION
    );
}


/*
Inserta un nuevo stand en MongoDB.
*/
async function crear(
    baseDatos,
    stand
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.insertOne(
            stand
        );

    // Agrega el identificador generado por MongoDB
    stand._id =
        resultado.insertedId;

    return stand;
}


/*
Obtiene todos los stands registrados.
*/
async function listar(baseDatos){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const stands =
        await coleccion
            .find()
            .sort({
                fechaRegistro: -1
            })
            .toArray();

    return stands;
}


/*
Obtiene un stand por su identificador.
*/
async function obtener(
    baseDatos,
    idStand
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const stand =
        await coleccion.findOne({
            _id: new ObjectId(
                idStand
            )
        });

    return stand;
}


/*
Modifica un stand.
*/
async function modificar(
    baseDatos,
    idStand,
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
                    idStand
                )
            },
            {
                $set: cambios
            }
        );

    return resultado;
}


/*
Elimina un stand.
*/
async function eliminar(
    baseDatos,
    idStand
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.deleteOne({
            _id: new ObjectId(
                idStand
            )
        });

    return resultado;
}


// Exporta las funciones de acceso a datos
module.exports = {
    crear,
    listar,
    obtener,
    modificar,
    eliminar
};