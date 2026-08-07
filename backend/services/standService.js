// Aquí está toda la lógica para insertar, buscar,
// modificar y eliminar stands en MongoDB.

// Importa el tipo de dato especial que usa MongoDB para los _id (ObjectId)
const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "stands";

// Inserta el stand en MongoDB
async function insertarStand(baseDatos, stand){

    const coleccionStands = baseDatos.collection(COLECCION);

    const resultado = await coleccionStands.insertOne(stand);

    return resultado;
}

// Obtiene todos los stands guardados en MongoDB
async function obtenerStands(baseDatos){

    const coleccionStands =
        baseDatos.collection(COLECCION);

    // Consulta todos los documentos y los convierte en un arreglo
    const stands =
        await coleccionStands
            .find()
            .sort({ fechaRegistro: -1 })
            .toArray();

    return stands;
}

// Obtiene el stand según su identificador
async function obtenerStandPorId(
    baseDatos,
    idStand
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idStand)){
        return null;
    }

    const coleccionStands =
        baseDatos.collection(COLECCION);

    const stand =
        await coleccionStands.findOne(
            {
                _id: new ObjectId(idStand)
            }
        );

    return stand;
}

// Modifica el stand según su identificador
async function modificarStand(
    baseDatos,
    idStand,
    datosActualizados
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idStand)){
        return null;
    }

    const coleccionStands =
        baseDatos.collection(COLECCION);

    // Actualiza únicamente los campos permitidos
    const resultado =
        await coleccionStands.updateOne(
            {
                _id: new ObjectId(idStand)
            },
            {
                $set: datosActualizados
            }
        );

    return resultado;
}

// Elimina el stand según su identificador
async function eliminarStand(baseDatos, idStand){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idStand)){
        return null;
    }

    const coleccionStands =
        baseDatos.collection(COLECCION);

    const resultado =
        await coleccionStands.deleteOne({
            _id: new ObjectId(idStand)
        });

    return resultado;
}

module.exports = {
    insertarStand,
    obtenerStands,
    obtenerStandPorId,
    modificarStand,
    eliminarStand
};
