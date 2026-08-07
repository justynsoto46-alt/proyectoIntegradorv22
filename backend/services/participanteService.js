//Aquí irá toda la lógica para:
// insertar
// buscar
// modificar
// eliminar

// Su trabajo será hablar con MongoDB.


// Convierte el texto recibido en un ObjectId
// Importa el tipo de dato especial que usa MongoDB para los _id (ObjectId)
const { ObjectId } = require("mongodb");


// Nombre de la colección
const COLECCION = "participantes";

// Inserta un participante en MongoDB
async function insertarParticipante(baseDatos, participante){

    const coleccionParticipantes = baseDatos.collection(COLECCION);

    const resultado = await coleccionParticipantes.insertOne(participante);

    return resultado;
}

// Obtiene todos los participantes guardados en MongoDB
async function obtenerParticipantes(baseDatos){

    // Obtiene la colección de participantes
    const coleccionParticipantes =
        baseDatos.collection(COLECCION);

    // Consulta todos los documentos y los convierte en un arreglo
    const participantes =
        await coleccionParticipantes.find().toArray();

    return participantes;
}

// Elimina un participante según su identificador
async function eliminarParticipante(baseDatos, idParticipante){

    // Obtiene la colección de participantes
    const coleccionParticipantes =
        baseDatos.collection(COLECCION);

    // Elimina el participante indicado
    const resultado =
        await coleccionParticipantes.deleteOne({
            _id: new ObjectId(idParticipante)
        });

    return resultado;
}

// Obtiene un participante según su identificador
async function obtenerParticipantePorId(
    baseDatos,
    idParticipante
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idParticipante)){
        return null;
    }

    // Obtiene la colección de participantes
    const coleccionParticipantes =
        baseDatos.collection(COLECCION);

    // Busca el participante por su _id
    const participante =
        await coleccionParticipantes.findOne({
            _id: new ObjectId(idParticipante)
        });

    return participante;
}

// Busca un participante según su número de identificación
async function obtenerParticipantePorIdentificacion(
    baseDatos,
    identificacion
){

    // Obtiene la colección de participantes
    const coleccionParticipantes =
        baseDatos.collection(COLECCION);

    // Busca un participante con la identificación indicada
    const participante =
        await coleccionParticipantes.findOne({
            identificacion: identificacion
        });

    return participante;
}

// Modifica un participante según su identificador
async function modificarParticipante(
    baseDatos,
    idParticipante,
    datosActualizados
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idParticipante)){
        return null;
    }

    // Obtiene la colección de participantes
    const coleccionParticipantes =
        baseDatos.collection(COLECCION);

    // Actualiza únicamente los campos permitidos
    const resultado =
        await coleccionParticipantes.updateOne(
            {
                _id: new ObjectId(idParticipante)
            },
            {
                $set: datosActualizados
            }
        );

    return resultado;
}


module.exports = {
    insertarParticipante,
    obtenerParticipantes,
    obtenerParticipantePorId,
    obtenerParticipantePorIdentificacion,
    modificarParticipante,
    eliminarParticipante
};