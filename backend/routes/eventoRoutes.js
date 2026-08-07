const express = require("express");

// Crea el enrutador de eventos
const router = express.Router();

// Importa el controlador
const {
    registrarEvento,
    listarEventos,
    consultarEventoPorId,
    modificarEventoPorId,
    eliminarEventoPorId
} = require("../controllers/eventoController");


// Ruta para registrar el evento
router.post("/", registrarEvento);

// Ruta para consultar todos los eventos
router.get("/", listarEventos);

// Ruta para consultar el evento por su identificador
router.get("/:id", consultarEventoPorId);

// Ruta para modificar el evento
router.put("/:id", modificarEventoPorId);

// Ruta para eliminar el evento
router.delete("/:id", eliminarEventoPorId);

// Exporta el router
module.exports = router;
