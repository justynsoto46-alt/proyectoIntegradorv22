const express = require("express");

// Crea el enrutador de stands
const router = express.Router();

// Importa el controlador
const {
    registrarStand,
    listarStands,
    consultarStandPorId,
    modificarStandPorId,
    eliminarStandPorId
} = require("../controllers/standController");


// Ruta para registrar el stand
router.post("/", registrarStand);

// Ruta para consultar todos los stands
router.get("/", listarStands);

// Ruta para consultar el stand por su identificador
router.get("/:id", consultarStandPorId);

// Ruta para modificar el stand
router.put("/:id", modificarStandPorId);

// Ruta para eliminar el stand
router.delete("/:id", eliminarStandPorId);

// Exporta el router
module.exports = router;
