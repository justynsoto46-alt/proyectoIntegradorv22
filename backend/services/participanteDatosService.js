/*
============================================================
SERVICIO DE ACCESO A DATOS DE PARTICIPANTES
============================================================

Este archivo se comunica directamente con MongoDB.

Aquí se realizan las operaciones CRUD sobre la colección
"participantes".

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "participantes";


/*
Obtiene la colección de participantes.

Recibe la base de datos y devuelve directamente
la colección "participantes".
*/
function obtenerColeccion(baseDatos){

    const coleccion =
        baseDatos.collection(COLECCION);

    return coleccion;
}


/*
Inserta un nuevo participante en MongoDB.
*/
async function crear(
    baseDatos,
    participante
){

    // Obtiene la colección
    const coleccion =
        obtenerColeccion(baseDatos);

    // Inserta el participante
    const resultado =
        await coleccion.insertOne(
            participante
        );

    // Agrega el identificador generado por MongoDB
    participante._id =
        resultado.insertedId;

    // Devuelve el participante completo
    return participante;
}


/*
Obtiene todos los participantes registrados.
*/
async function listar(baseDatos){

    // Obtiene la colección
    const coleccion =
        obtenerColeccion(baseDatos);

    // Consulta todos los participantes
    const participantes =
        await coleccion
            .find()
            .sort({
                fechaRegistro: -1
            })
            .toArray();

    return participantes;
}


/*
Busca un participante por su identificador de MongoDB.
*/
async function obtener(
    baseDatos,
    idParticipante
){

    // Obtiene la colección
    const coleccion =
        obtenerColeccion(baseDatos);

    // Convierte el id recibido a ObjectId
    const idMongo =
        new ObjectId(idParticipante);

    // Busca el participante
    const participante =
        await coleccion.findOne({
            _id: idMongo
        });

    return participante;
}


/*
Busca un participante por su número de identificación.
*/
async function obtenerPorIdentificacion(
    baseDatos,
    identificacion
){

    // Obtiene la colección
    const coleccion =
        obtenerColeccion(baseDatos);

    // Busca el participante
    const participante =
        await coleccion.findOne({
            identificacion: identificacion
        });

    return participante;
}


/*
Modifica un participante.
*/
async function modificar(
    baseDatos,
    idParticipante,
    cambios
){

    // Obtiene la colección
    const coleccion =
        obtenerColeccion(baseDatos);

    // Convierte el id a ObjectId
    const idMongo =
        new ObjectId(idParticipante);

    // Crea el filtro
    const filtro = {
        _id: idMongo
    };

    // Define los nuevos valores
    const nuevosValores = {
        $set: cambios
    };

    // Actualiza el participante
    const resultado =
        await coleccion.updateOne(
            filtro,
            nuevosValores
        );

    return resultado;
}


/*
Elimina un participante.
*/
async function eliminar(
    baseDatos,
    idParticipante
){

    // Obtiene la colección
    const coleccion =
        obtenerColeccion(baseDatos);

    // Convierte el id a ObjectId
    const idMongo =
        new ObjectId(idParticipante);

    // Elimina el participante
    const resultado =
        await coleccion.deleteOne({
            _id: idMongo
        });

    return resultado;
}


// Exporta las funciones de acceso a datos
module.exports = {
    crear,
    listar,
    obtener,
    obtenerPorIdentificacion,
    modificar,
    eliminar
};