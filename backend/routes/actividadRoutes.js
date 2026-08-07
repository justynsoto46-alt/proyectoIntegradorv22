const express = require("express");

// Crea el enrutador de actividades
const router = express.Router();

// Importa el controlador
const {
    registrarActividad,
    listarActividades,
    consultarActividadPorId,
    modificarActividadPorId,
    eliminarActividadPorId
} = require("../controllers/actividadController");


// Ruta para registrar la actividad
router.post("/", registrarActividad);

// Ruta para consultar todas las actividades
router.get("/", listarActividades);

// Ruta para consultar la actividad por su identificador
router.get("/:id", consultarActividadPorId);

// Ruta para modificar la actividad
router.put("/:id", modificarActividadPorId);

// Ruta para eliminar la actividad
router.delete("/:id", eliminarActividadPorId);

// Exporta el router
module.exports = router;
