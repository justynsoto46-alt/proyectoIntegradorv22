// Carga las variables del archivo .env
require("dotenv").config();

// Importa MongoClient desde la librería de MongoDB
const { MongoClient } = require("mongodb");

// Obtiene la cadena de conexión y el nombre de la base de datos
const uri = process.env.MONGO_URI;
const nombreBaseDatos = process.env.DB_NAME;

// Crea el cliente que permitirá conectarse a MongoDB Atlas
const clienteMongo = new MongoClient(uri);

// Función para conectarse a MongoDB Atlas
async function conectarBaseDatos() {

    await clienteMongo.connect();

    const baseDatos = clienteMongo.db(nombreBaseDatos);

    // Crea un índice único para impedir identificaciones duplicadas
    await baseDatos
        .collection("participantes")
        .createIndex(
            { identificacion: 1 },
            { unique: true }
        );

    // Crea un índice único para impedir correos duplicados de administradores
    await baseDatos
        .collection("administradores")
        .createIndex(
            { correo: 1 },
            { unique: true }
        );

    // Crea un índice único para impedir correos duplicados de responsables
    await baseDatos
        .collection("responsables")
        .createIndex(
            { correo: 1 },
            { unique: true }
        );

    console.log("Conexión exitosa con MongoDB Atlas");

    return baseDatos;
}

module.exports = {
    conectarBaseDatos
};