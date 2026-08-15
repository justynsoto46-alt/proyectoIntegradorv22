/*
============================================================
CONTROLADOR DE CONTRASEÑA
============================================================

Este archivo recibe la petición para modificar
la contraseña de un administrador.

Aquí NO se accede directamente a MongoDB.

Flujo:
Route -> Controller -> Service -> DatosService -> MongoDB
============================================================
*/


// Importa la función del servicio de contraseña
const {
    modificarContrasena:
        modificarContrasenaService
} = require("../services/contrasenaService");


/*
Función para modificar la contraseña.
*/
async function modificarContrasena(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene los datos enviados desde el frontend
        const {
            correo,
            nuevaContrasena
        } = req.body;


        // Verifica que ambos datos hayan sido enviados
        if(
            !correo ||
            !nuevaContrasena
        ){

            return res.status(400).json({

                mensaje:
                    "Debe ingresar el correo y la nueva contraseña."
            });
        }


        // Solicita al service modificar la contraseña.
        // El service verifica que el administrador exista.
        await modificarContrasenaService(
            baseDatos,
            correo,
            nuevaContrasena
        );


        // Respuesta exitosa
        res.status(200).json({

            mensaje:
                "La contraseña fue modificada correctamente."
        });

    } catch(error){

        console.error(
            "Error al modificar contraseña:",
            error
        );


        // Utiliza el código definido por el service.
        // Por ejemplo:
        // 404 -> administrador no encontrado
        // 400 -> nueva contraseña igual a la anterior
        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No fue posible modificar la contraseña."
        });
    }
}


// Exporta el controlador
module.exports = {
    modificarContrasena
};