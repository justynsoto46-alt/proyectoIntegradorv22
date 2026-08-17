/*
============================================================
RUTAS DE GEMINI
============================================================

Define las rutas relacionadas con la mejora de textos
por medio de inteligencia artificial.

La ruta base se configura en server.js como:
/api/gemini

Flujo:
Route -> Controller -> Service -> API de Gemini
============================================================
*/

// Importa Express
const express = require("express");

// Crea el router
const router = express.Router();


// Importa las funciones del controlador
const {
    mejorarDescripcion
} = require("../controllers/geminiController");


// Ruta para mejorar la descripción
// de una actividad o de un evento
router.post(
    "/mejorar-descripcion",
    mejorarDescripcion
);


// Exporta el router
module.exports = router;
