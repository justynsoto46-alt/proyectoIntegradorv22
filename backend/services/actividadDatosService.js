/*
============================================================
SERVICIO DE ACCESO A DATOS DE ACTIVIDADES
============================================================

Este archivo se comunica directamente con MongoDB.

Aquí se realizan las operaciones CRUD sobre la colección
"actividades".

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "actividades";


/*
Obtiene la colección de actividades.
*/
function obtenerColeccion(baseDatos){

    return baseDatos.collection(
        COLECCION
    );
}


/*
Inserta una nueva actividad en MongoDB.
*/
async function crear(
    baseDatos,
    actividad
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.insertOne(
            actividad
        );

    // Agrega el identificador generado por MongoDB
    actividad._id =
        resultado.insertedId;

    return actividad;
}


/*
Obtiene todas las actividades registradas.
*/
async function listar(baseDatos){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const actividades =
        await coleccion
            .find()
            .sort({
                fechaRegistro: -1
            })
            .toArray();

    return actividades;
}


/*
Obtiene una actividad por su identificador.
*/
async function obtener(
    baseDatos,
    idActividad
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const actividad =
        await coleccion.findOne({
            _id: new ObjectId(
                idActividad
            )
        });

    return actividad;
}


/*
Modifica una actividad.
*/
async function modificar(
    baseDatos,
    idActividad,
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
                    idActividad
                )
            },
            {
                $set: cambios
            }
        );

    return resultado;
}


/*
Elimina una actividad.
*/
async function eliminar(
    baseDatos,
    idActividad
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.deleteOne({
            _id: new ObjectId(
                idActividad
            )
        });

    return resultado;
}

/*
Actualiza el cupo disponible de una actividad.
*/
async function actualizarCupo(
    baseDatos,
    idActividad,
    nuevoCupo
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.updateOne(
            {
                _id: new ObjectId(
                    idActividad
                )
            },
            {
                $set: {
                    cupo: nuevoCupo
                }
            }
        );

    return resultado;
}


// Exporta las funciones de acceso a datos
module.exports = {
    crear,
    listar,
    obtener,
    modificar,
    eliminar,
    actualizarCupo
};