/*
============================================================
CONTROLADOR DE CORREO ELECTRÓNICO
============================================================

Este archivo recibe las peticiones relacionadas con correo.

Aquí NO se utiliza Nodemailer directamente y no se
conoce la configuración SMTP.

Flujo:
Route -> Controller -> Service -> servidor SMTP
============================================================
*/


// Importa la función del servicio de correo
const {
    enviarCorreoPrueba: enviarCorreoPruebaService
} = require("../services/correoService");


/*
Función para enviar un correo de prueba.

POST /api/correos/prueba

Permite comprobar que las variables SMTP estén
bien configuradas antes de trabajar con datos reales.
*/
async function enviarPrueba(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;


        // Solicita el envío al service
        const resultado =
            await enviarCorreoPruebaService(
                baseDatos
            );


        // Responde al cliente
        res.status(200).json({

            mensaje:
                "Correo de prueba enviado correctamente.",

            identificadorMensaje:
                resultado.messageId
        });

    } catch(error){

        console.error(
            "Error al enviar el correo de prueba:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo enviar el correo de prueba."
        });
    }
}


// Exporta las funciones del controlador
module.exports = {
    enviarPrueba
};
