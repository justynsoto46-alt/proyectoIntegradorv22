// Importa Express
const express = require("express");

// Crea el router
const router = express.Router();

// Importa el controlador
const {
    modificarContrasena
} = require("../controllers/contrasenaController");


// Ruta para modificar la contraseña
router.post(
    "/modificar",
    modificarContrasena
);


// Exporta el router
module.exports = router;