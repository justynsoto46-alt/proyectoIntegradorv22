// Aquí está toda la lógica para insertar, buscar,
// modificar y eliminar eventos en MongoDB.

// Importa el tipo de dato especial que usa MongoDB para los _id (ObjectId)
const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "eventos";

// Inserta el evento en MongoDB
async function insertarEvento(baseDatos, evento){

    const coleccionEventos = baseDatos.collection(COLECCION);

    const resultado = await coleccionEventos.insertOne(evento);

    return resultado;
}

// Obtiene todos los eventos guardados en MongoDB
async function obtenerEventos(baseDatos){

    const coleccionEventos =
        baseDatos.collection(COLECCION);

    // Consulta todos los documentos y los convierte en un arreglo
    const eventos =
        await coleccionEventos
            .find()
            .sort({ fechaRegistro: -1 })
            .toArray();

    return eventos;
}

// Obtiene el evento según su identificador
async function obtenerEventoPorId(
    baseDatos,
    idEvento
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idEvento)){
        return null;
    }

    const coleccionEventos =
        baseDatos.collection(COLECCION);

    const evento =
        await coleccionEventos.findOne(
            {
                _id: new ObjectId(idEvento)
            }
        );

    return evento;
}

// Modifica el evento según su identificador
async function modificarEvento(
    baseDatos,
    idEvento,
    datosActualizados
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idEvento)){
        return null;
    }

    const coleccionEventos =
        baseDatos.collection(COLECCION);

    // Actualiza únicamente los campos permitidos
    const resultado =
        await coleccionEventos.updateOne(
            {
                _id: new ObjectId(idEvento)
            },
            {
                $set: datosActualizados
            }
        );

    return resultado;
}

// Elimina el evento según su identificador
async function eliminarEvento(baseDatos, idEvento){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idEvento)){
        return null;
    }

    const coleccionEventos =
        baseDatos.collection(COLECCION);

    const resultado =
        await coleccionEventos.deleteOne({
            _id: new ObjectId(idEvento)
        });

    return resultado;
}

module.exports = {
    insertarEvento,
    obtenerEventos,
    obtenerEventoPorId,
    modificarEvento,
    eliminarEvento
};
