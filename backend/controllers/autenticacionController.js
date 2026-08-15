/*
============================================================
CONTROLADOR DE AUTENTICACIÓN
============================================================

Este archivo recibe las credenciales enviadas
desde el frontend y coordina el inicio de sesión.

Aquí NO se accede directamente a MongoDB.

Flujo:
Route -> Controller -> Service -> DatosService -> MongoDB
============================================================
*/


// Importa la función del servicio de autenticación
const {
    iniciarSesion: iniciarSesionService
} = require("../services/autenticacionService");


/*
Función para iniciar sesión.
*/
async function iniciarSesion(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene las credenciales enviadas
        // desde el frontend
        const {
            correo,
            contrasena
        } = req.body;


        // Verifica que ambos campos hayan sido enviados
        if(!correo || !contrasena){

            return res.status(400).json({

                mensaje:
                    "Debe ingresar el correo y la contraseña."
            });
        }


        // Envía las credenciales al service.
        // El service valida si existe el administrador
        // y si la contraseña es correcta.
        const administrador =
            await iniciarSesionService(
                baseDatos,
                correo,
                contrasena
            );


        // Devuelve únicamente los datos necesarios
        // del administrador al frontend.
        // La contraseña nunca se envía.
        res.status(200).json({

            mensaje:
                "Inicio de sesión exitoso.",

            administrador: {

                _id:
                    administrador._id,

                nombreCompleto:
                    administrador.nombreCompleto,

                correo:
                    administrador.correo,

                rol:
                    administrador.rol
            }
        });

    } catch(error){

        console.error(
            "Error al iniciar sesión:",
            error
        );


        // Utiliza el código generado por el service.
        // Por ejemplo:
        // 401 -> credenciales incorrectas
        // 500 -> error interno
        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo iniciar sesión."
        });
    }
}


// Exporta la función del controlador
module.exports = {
    iniciarSesion
};