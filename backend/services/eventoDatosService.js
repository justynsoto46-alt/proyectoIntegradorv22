/*
============================================================
SERVICIO DE ACCESO A DATOS DE EVENTOS
============================================================

Este archivo se comunica directamente con MongoDB.

Aquí se realizan las operaciones CRUD sobre la colección
"eventos".

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "eventos";


/*
Obtiene la colección de eventos.
*/
function obtenerColeccion(baseDatos){

    return baseDatos.collection(
        COLECCION
    );
}


/*
Inserta un nuevo evento en MongoDB.
*/
async function crear(
    baseDatos,
    evento
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.insertOne(
            evento
        );

    // Agrega el identificador generado por MongoDB
    evento._id =
        resultado.insertedId;

    return evento;
}


/*
Obtiene todos los eventos registrados.
*/
async function listar(baseDatos){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const eventos =
        await coleccion
            .find()
            .sort({
                fechaRegistro: -1
            })
            .toArray();

    return eventos;
}


/*
Obtiene un evento por su identificador.
*/
async function obtener(
    baseDatos,
    idEvento
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const evento =
        await coleccion.findOne({
            _id: new ObjectId(
                idEvento
            )
        });

    return evento;
}


/*
Modifica un evento.
*/
async function modificar(
    baseDatos,
    idEvento,
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
                    idEvento
                )
            },
            {
                $set: cambios
            }
        );

    return resultado;
}


/*
Elimina un evento.
*/
async function eliminar(
    baseDatos,
    idEvento
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.deleteOne({
            _id: new ObjectId(
                idEvento
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