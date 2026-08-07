// Carga las variables del archivo .env
require("dotenv").config();

// Importa las dependencias necesarias
const path = require("path");
const express = require("express");

// Importa la función para conectarse a MongoDB
const { conectarBaseDatos } = require("./database/conexion");

// Crea la aplicación de Express
const app = express();

// Obtiene el puerto desde el archivo .env
const puerto = Number(process.env.PORT) || 3000;

// Obtiene la ruta absoluta de la carpeta public
const carpetaPublica = path.join(__dirname, "../public");

// Obtiene las rutas de cada módulo
const participanteRoutes =
    require("./routes/participanteRoutes");

const eventoRoutes =
    require("./routes/eventoRoutes");

const actividadRoutes =
    require("./routes/actividadRoutes");

const standRoutes =
    require("./routes/standRoutes");

const responsableRoutes =
    require("./routes/responsableRoutes");

const administradorRoutes =
    require("./routes/administradorRoutes");

// Permite recibir información en formato JSON
app.use(express.json());

// Registra las rutas de cada módulo
app.use("/api/participantes", participanteRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/actividades", actividadRoutes);
app.use("/api/stands", standRoutes);
app.use("/api/responsables", responsableRoutes);
app.use("/api/administradores", administradorRoutes);

// Permite que Express muestre los archivos del frontend
app.use(express.static(carpetaPublica));

// Ruta temporal para comprobar que el servidor funciona
app.get("/api/prueba", function (req, res) {

    res.json({
        mensaje: "El servidor funciona correctamente"
    });
});

// Función para iniciar la aplicación
async function iniciarServidor() {

    try {

        // Se conecta a MongoDB antes de iniciar el servidor
        const baseDatos = await conectarBaseDatos();

        // Guarda la conexión para poder utilizarla después
        app.locals.baseDatos = baseDatos;

        // Inicia el servidor
        app.listen(puerto, function () {

            console.log(`Aplicación disponible en http://localhost:${puerto}`);

        });

    } catch (error) {

        console.error("No se pudo iniciar la aplicación:", error.message);

    }
}

// Ejecuta la función principal
iniciarServidor();