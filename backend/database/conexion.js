// Carga las variables del archivo .env
require("dotenv").config();

// Importa MongoClient desde la librería de MongoDB
const { MongoClient } = require("mongodb");

// Obtiene la cadena de conexión y el nombre de la base de datos
const uri = process.env.MONGO_URI;
const nombreBaseDatos = process.env.DB_NAME;

// Crea el cliente que permitirá conectarse a MongoDB Atlas
const clienteMongo = new MongoClient(uri);


// Función para crear un administrador inicial
// únicamente cuando no existen administradores registrados
async function crearAdministradorInicial(baseDatos){

    // Obtiene la colección de administradores
    const coleccionAdministradores =
        baseDatos.collection("administradores");

    // Cuenta cuántos administradores existen
    const cantidadAdministradores =
        await coleccionAdministradores.countDocuments();

    // Si no existe ningún administrador, crea uno inicial
    if(cantidadAdministradores === 0){

        const administradorInicial = {
            nombreCompleto: "Administrador CENFOTEC",
            correo: "admin@ucenfotec.ac.cr",
            contrasena: "Hwk$2026",
            rol: "Administrador"
        };

        await coleccionAdministradores.insertOne(
            administradorInicial
        );

        console.log(
            "Administrador inicial creado correctamente"
        );
    }
}


// Función para conectarse a MongoDB Atlas
async function conectarBaseDatos(){

    // Realiza la conexión con MongoDB Atlas
    await clienteMongo.connect();

    // Obtiene la base de datos del proyecto
    const baseDatos =
        clienteMongo.db(nombreBaseDatos);


    // Crea un índice único para impedir
    // identificaciones duplicadas de participantes
    await baseDatos
        .collection("participantes")
        .createIndex(
            { identificacion: 1 },
            { unique: true }
        );


    // Crea un índice único para impedir
    // correos duplicados de administradores
    await baseDatos
        .collection("administradores")
        .createIndex(
            { correo: 1 },
            { unique: true }
        );


    // Crea un índice único para impedir
    // correos duplicados de responsables
    await baseDatos
        .collection("responsables")
        .createIndex(
            { correo: 1 },
            { unique: true }
        );


    // Verifica si se necesita crear
    // el administrador inicial
    await crearAdministradorInicial(
        baseDatos
    );


    console.log(
        "Conexión exitosa con MongoDB Atlas"
    );

    // Devuelve la conexión para utilizarla en el servidor
    return baseDatos;
}


// Exporta la función de conexión
module.exports = {
    conectarBaseDatos
};