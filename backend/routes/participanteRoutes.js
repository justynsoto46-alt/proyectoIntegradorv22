const express = require("express");

// Crea el enrutador de participantes
const router = express.Router();

// Importa el controlador
const {
    registrarParticipante,
    listarParticipantes,
    consultarParticipantePorId,
    modificarParticipantePorId,
    eliminarParticipantePorId
} = require("../controllers/participanteController");


// Ruta para registrar un participante
router.post("/", registrarParticipante);

// Ruta para consultar todos los participantes
router.get("/", listarParticipantes);

// Ruta para consultar un participante por su identificador
router.get("/:id", consultarParticipantePorId);

// Ruta para modificar un participante
router.put("/:id", modificarParticipantePorId);

// Ruta para eliminar un participante por su identificador
router.delete("/:id", eliminarParticipantePorId);

// Exporta el router
module.exports = router;