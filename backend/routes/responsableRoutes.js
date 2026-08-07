const express = require("express");

// Crea el enrutador de responsables
const router = express.Router();

// Importa el controlador
const {
    registrarResponsable,
    listarResponsables,
    consultarResponsablePorId,
    modificarResponsablePorId,
    eliminarResponsablePorId
} = require("../controllers/responsableController");


// Ruta para registrar el responsable
router.post("/", registrarResponsable);

// Ruta para consultar todos los responsables
router.get("/", listarResponsables);

// Ruta para consultar el responsable por su identificador
router.get("/:id", consultarResponsablePorId);

// Ruta para modificar el responsable
router.put("/:id", modificarResponsablePorId);

// Ruta para eliminar el responsable
router.delete("/:id", eliminarResponsablePorId);

// Exporta el router
module.exports = router;
