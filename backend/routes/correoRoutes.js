/*
============================================================
RUTAS DE CORREO ELECTRÓNICO
============================================================

Define las rutas relacionadas con el envío de correo.

La ruta base se configura en server.js como:
/api/correos

Flujo:
Route -> Controller -> Service -> servidor SMTP
============================================================
*/

// Importa Express
const express = require("express");

// Crea el router
const router = express.Router();


// Importa las funciones del controlador
const {
    enviarPrueba
} = require("../controllers/correoController");


// Ruta para comprobar la configuración SMTP
router.post(
    "/prueba",
    enviarPrueba
);


// Exporta el router
module.exports = router;
