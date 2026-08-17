/*
============================================================
SERVICIO DE ACCESO A DATOS DE CORREOS
============================================================

Este archivo se comunica directamente con MongoDB.

Guarda un historial de los correos que la aplicación intenta
enviar. Sirve para revisar después si una notificación salió
correctamente o si falló.

Aquí NO se envían correos y no se conoce la configuración SMTP.

Flujo:
Service -> DatosService -> MongoDB
============================================================
*/

// Nombre de la colección
const COLECCION = "historial_correos";


/*
Obtiene la colección del historial de correos.
*/
function obtenerColeccion(baseDatos){

    return baseDatos.collection(
        COLECCION
    );
}


/*
Guarda un registro del envío.

El objeto "datos" contiene información como:
- destinatario
- asunto
- motivo
- estado
- mensaje de error, si existió
- fecha de envío
*/
async function guardarHistorial(
    baseDatos,
    datos
){

    const coleccion =
        obtenerColeccion(
            baseDatos
        );

    await coleccion.insertOne(
        datos
    );
}


// Exporta las funciones de acceso a datos
module.exports = {
    guardarHistorial
};
