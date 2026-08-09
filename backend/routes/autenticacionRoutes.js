// Importa Express
const express = require("express");

// Crea el router
const router = express.Router();

// Importa el controlador de autenticación
const {
    iniciarSesion
} = require("../controllers/autenticacionController");


// Ruta para iniciar sesión
router.post(
    "/iniciar-sesion",
    iniciarSesion
);


// Exporta el router
module.exports = router;