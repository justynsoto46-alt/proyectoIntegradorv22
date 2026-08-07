// Aquí está toda la lógica para insertar, buscar,
// modificar y eliminar actividades en MongoDB.

// Importa el tipo de dato especial que usa MongoDB para los _id (ObjectId)
const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "actividades";

// Inserta la actividad en MongoDB
async function insertarActividad(baseDatos, actividad){

    const coleccionActividades = baseDatos.collection(COLECCION);

    const resultado = await coleccionActividades.insertOne(actividad);

    return resultado;
}

// Obtiene todas las actividades guardados en MongoDB
async function obtenerActividades(baseDatos){

    const coleccionActividades =
        baseDatos.collection(COLECCION);

    // Consulta todos los documentos y los convierte en un arreglo
    const actividades =
        await coleccionActividades
            .find()
            .sort({ fechaRegistro: -1 })
            .toArray();

    return actividades;
}

// Obtiene la actividad según su identificador
async function obtenerActividadPorId(
    baseDatos,
    idActividad
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idActividad)){
        return null;
    }

    const coleccionActividades =
        baseDatos.collection(COLECCION);

    const actividad =
        await coleccionActividades.findOne(
            {
                _id: new ObjectId(idActividad)
            }
        );

    return actividad;
}

// Modifica la actividad según su identificador
async function modificarActividad(
    baseDatos,
    idActividad,
    datosActualizados
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idActividad)){
        return null;
    }

    const coleccionActividades =
        baseDatos.collection(COLECCION);

    // Actualiza únicamente los campos permitidos
    const resultado =
        await coleccionActividades.updateOne(
            {
                _id: new ObjectId(idActividad)
            },
            {
                $set: datosActualizados
            }
        );

    return resultado;
}

// Elimina la actividad según su identificador
async function eliminarActividad(baseDatos, idActividad){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idActividad)){
        return null;
    }

    const coleccionActividades =
        baseDatos.collection(COLECCION);

    const resultado =
        await coleccionActividades.deleteOne({
            _id: new ObjectId(idActividad)
        });

    return resultado;
}

module.exports = {
    insertarActividad,
    obtenerActividades,
    obtenerActividadPorId,
    modificarActividad,
    eliminarActividad
};
