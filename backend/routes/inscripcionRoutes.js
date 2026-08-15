/*
============================================================
RUTAS DE INSCRIPCIONES
============================================================

Define las rutas disponibles para trabajar
con inscripciones.

Flujo:
Route -> Controller -> Service -> DatosService -> MongoDB
============================================================
*/

// Importa Express
const express = require("express");

// Crea el router
const router = express.Router();


// Importa las funciones del controlador
const {
    registrarInscripcion,
    listarInscripcionesPorParticipante,
    listarInscripcionesPorActividad,
    buscarInscripcionesPorIdentificacion,
    eliminarInscripcionPorId
} = require("../controllers/inscripcionController");


// Ruta para registrar una inscripción
router.post(
    "/",
    registrarInscripcion
);


// Ruta para buscar un participante
// por identificación y obtener todas
// sus inscripciones
router.get(
    "/identificacion/:identificacion",
    buscarInscripcionesPorIdentificacion
);


// Ruta para consultar las inscripciones
// de un participante
router.get(
    "/participante/:participanteId",
    listarInscripcionesPorParticipante
);


// Ruta para consultar las inscripciones
// de una actividad
router.get(
    "/actividad/:actividadId",
    listarInscripcionesPorActividad
);


// Ruta para cancelar una inscripción
router.delete(
    "/:id",
    eliminarInscripcionPorId
);


// Exporta el router
module.exports = router;