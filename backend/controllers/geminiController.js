/*
============================================================
CONTROLADOR DE GEMINI
============================================================

Este archivo recibe la petición del frontend para mejorar
la descripción de un evento o de una actividad.

Aquí NO se llama directamente a la API de Gemini.

Flujo:
Route -> Controller -> Service -> API de Gemini
============================================================
*/


// Importa la función del servicio de Gemini
const {
    mejorarDescripcion: mejorarDescripcionService
} = require("../services/geminiService");


/*
Función para mejorar la descripción.

POST /api/gemini/mejorar-descripcion
*/
async function mejorarDescripcion(req, res){

    try{

        // Obtiene los datos enviados desde el frontend
        const datos =
            req.body;


        // Solicita la mejora al service.
        // El service valida la información recibida.
        const resultado =
            await mejorarDescripcionService(
                datos
            );


        // Devuelve la descripción mejorada al frontend
        res.status(200).json(
            resultado
        );

    } catch(error){

        console.error(
            "Error al mejorar la descripción:",
            error
        );


        // Utiliza el estado definido por el service.
        // Por ejemplo:
        // 400 -> datos incompletos
        // 502 -> Gemini rechazó la solicitud
        // 503 -> Gemini no está configurado
        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo mejorar la descripción."
        });
    }
}


// Exporta las funciones del controlador
module.exports = {
    mejorarDescripcion
};
