// Aquí está toda la lógica para insertar, buscar,
// modificar y eliminar responsables en MongoDB.

// Importa el tipo de dato especial que usa MongoDB para los _id (ObjectId)
const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "responsables";

// Inserta el responsable en MongoDB
async function insertarResponsable(baseDatos, responsable){

    const coleccionResponsables = baseDatos.collection(COLECCION);

    const resultado = await coleccionResponsables.insertOne(responsable);

    return resultado;
}

// Obtiene todos los responsables guardados en MongoDB
async function obtenerResponsables(baseDatos){

    const coleccionResponsables =
        baseDatos.collection(COLECCION);

    // Consulta todos los documentos y los convierte en un arreglo
    const responsables =
        await coleccionResponsables
            .find()
            .sort({ fechaRegistro: -1 })
            .toArray();

    return responsables;
}

// Obtiene el responsable según su identificador
async function obtenerResponsablePorId(
    baseDatos,
    idResponsable
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idResponsable)){
        return null;
    }

    const coleccionResponsables =
        baseDatos.collection(COLECCION);

    const responsable =
        await coleccionResponsables.findOne(
            {
                _id: new ObjectId(idResponsable)
            }
        );

    return responsable;
}

// Busca el responsable según su correo
async function obtenerResponsablePorCorreo(
    baseDatos,
    correo
){

    const coleccionResponsables =
        baseDatos.collection(COLECCION);

    const responsable =
        await coleccionResponsables.findOne({
            correo: correo
        });

    return responsable;
}

// Modifica el responsable según su identificador
async function modificarResponsable(
    baseDatos,
    idResponsable,
    datosActualizados
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idResponsable)){
        return null;
    }

    const coleccionResponsables =
        baseDatos.collection(COLECCION);

    // Actualiza únicamente los campos permitidos
    const resultado =
        await coleccionResponsables.updateOne(
            {
                _id: new ObjectId(idResponsable)
            },
            {
                $set: datosActualizados
            }
        );

    return resultado;
}

// Elimina el responsable según su identificador
async function eliminarResponsable(baseDatos, idResponsable){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idResponsable)){
        return null;
    }

    const coleccionResponsables =
        baseDatos.collection(COLECCION);

    const resultado =
        await coleccionResponsables.deleteOne({
            _id: new ObjectId(idResponsable)
        });

    return resultado;
}

module.exports = {
    insertarResponsable,
    obtenerResponsables,
    obtenerResponsablePorId,
    obtenerResponsablePorCorreo,
    modificarResponsable,
    eliminarResponsable
};
