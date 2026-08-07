const express = require("express");

// Crea el enrutador de administradores
const router = express.Router();

// Importa el controlador
const {
    registrarAdministrador,
    listarAdministradores,
    consultarAdministradorPorId,
    modificarAdministradorPorId,
    eliminarAdministradorPorId
} = require("../controllers/administradorController");


// Ruta para registrar el administrador
router.post("/", registrarAdministrador);

// Ruta para consultar todos los administradores
router.get("/", listarAdministradores);

// Ruta para consultar el administrador por su identificador
router.get("/:id", consultarAdministradorPorId);

// Ruta para modificar el administrador
router.put("/:id", modificarAdministradorPorId);

// Ruta para eliminar el administrador
router.delete("/:id", eliminarAdministradorPorId);

// Exporta el router
module.exports = router;
