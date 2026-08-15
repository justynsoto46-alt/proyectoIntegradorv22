/*
============================================================
SERVICIO DE ACCESO A DATOS DE INSCRIPCIONES
============================================================

Este archivo se comunica directamente con MongoDB.

Aquí se realizan las operaciones sobre la colección
"inscripciones".

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "inscripciones";


/*
Obtiene la colección de inscripciones.
*/
function obtenerColeccion(baseDatos){

    return baseDatos.collection(
        COLECCION
    );
}


/*
Inserta una nueva inscripción.
*/
async function crear(
    baseDatos,
    inscripcion
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.insertOne(
            inscripcion
        );

    inscripcion._id =
        resultado.insertedId;

    return inscripcion;
}


/*
Busca una inscripción por participante y actividad.
Sirve para evitar inscripciones duplicadas.
*/
async function obtenerPorParticipanteYActividad(
    baseDatos,
    participanteId,
    actividadId
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const inscripcion =
        await coleccion.findOne({

            participanteId:
                new ObjectId(participanteId),

            actividadId:
                new ObjectId(actividadId)
        });

    return inscripcion;
}


/*
Obtiene todas las inscripciones de un participante.
*/
async function listarPorParticipante(
    baseDatos,
    participanteId
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const inscripciones =
        await coleccion
            .find({

                participanteId:
                    new ObjectId(participanteId)
            })
            .sort({
                fechaRegistro: -1
            })
            .toArray();

    return inscripciones;
}


/*
Obtiene todas las inscripciones
de una actividad.
*/
async function listarPorActividad(
    baseDatos,
    actividadId
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const inscripciones =
        await coleccion
            .find({

                actividadId:
                    new ObjectId(actividadId)
            })
            .toArray();

    return inscripciones;
}


/*
Elimina una inscripción.
*/
async function eliminar(
    baseDatos,
    idInscripcion
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const resultado =
        await coleccion.deleteOne({

            _id:
                new ObjectId(idInscripcion)
        });

    return resultado;
}

/*
Obtiene una inscripción por su identificador.
*/
async function obtener(
    baseDatos,
    idInscripcion
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    const inscripcion =
        await coleccion.findOne({
            _id: new ObjectId(
                idInscripcion
            )
        });

    return inscripcion;
}

// Exporta las funciones
module.exports = {
    crear,
    obtener,
    obtenerPorParticipanteYActividad,
    listarPorParticipante,
    listarPorActividad,
    eliminar
};