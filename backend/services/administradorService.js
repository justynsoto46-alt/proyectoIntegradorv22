// Aquí está toda la lógica para insertar, buscar,
// modificar y eliminar administradores en MongoDB.

// Importa el tipo de dato especial que usa MongoDB para los _id (ObjectId)
const { ObjectId } = require("mongodb");

// Nombre de la colección
const COLECCION = "administradores";

// Campos que nunca se devuelven al frontend
const PROYECCION = {
    projection: {
        contrasena: 0
    }
};

// Inserta el administrador en MongoDB
async function insertarAdministrador(baseDatos, administrador){

    const coleccionAdministradores = baseDatos.collection(COLECCION);

    const resultado = await coleccionAdministradores.insertOne(administrador);

    return resultado;
}

// Obtiene todos los administradores guardados en MongoDB
async function obtenerAdministradores(baseDatos){

    const coleccionAdministradores =
        baseDatos.collection(COLECCION);

    // Consulta todos los documentos y los convierte en un arreglo
    const administradores =
        await coleccionAdministradores
            .find({}, PROYECCION)
            .sort({ fechaRegistro: -1 })
            .toArray();

    return administradores;
}

// Obtiene el administrador según su identificador
async function obtenerAdministradorPorId(
    baseDatos,
    idAdministrador
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idAdministrador)){
        return null;
    }

    const coleccionAdministradores =
        baseDatos.collection(COLECCION);

    const administrador =
        await coleccionAdministradores.findOne(
            {
                _id: new ObjectId(idAdministrador)
            }, PROYECCION
        );

    return administrador;
}

// Busca el administrador según su correo
async function obtenerAdministradorPorCorreo(
    baseDatos,
    correo
){

    const coleccionAdministradores =
        baseDatos.collection(COLECCION);

    const administrador =
        await coleccionAdministradores.findOne({
            correo: correo
        });

    return administrador;
}

// Modifica el administrador según su identificador
async function modificarAdministrador(
    baseDatos,
    idAdministrador,
    datosActualizados
){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idAdministrador)){
        return null;
    }

    const coleccionAdministradores =
        baseDatos.collection(COLECCION);

    // Actualiza únicamente los campos permitidos
    const resultado =
        await coleccionAdministradores.updateOne(
            {
                _id: new ObjectId(idAdministrador)
            },
            {
                $set: datosActualizados
            }
        );

    return resultado;
}

// Elimina el administrador según su identificador
async function eliminarAdministrador(baseDatos, idAdministrador){

    // Verifica que el identificador tenga un formato válido
    if(!ObjectId.isValid(idAdministrador)){
        return null;
    }

    const coleccionAdministradores =
        baseDatos.collection(COLECCION);

    const resultado =
        await coleccionAdministradores.deleteOne({
            _id: new ObjectId(idAdministrador)
        });

    return resultado;
}

module.exports = {
    insertarAdministrador,
    obtenerAdministradores,
    obtenerAdministradorPorId,
    obtenerAdministradorPorCorreo,
    modificarAdministrador,
    eliminarAdministrador
};
