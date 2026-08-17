/*
============================================================
SERVICIO DE GEMINI
============================================================

Este archivo se comunica con la API de Google Gemini para
mejorar la redacción de las descripciones de eventos
y actividades.

La clave de Gemini NUNCA se coloca en el frontend.
Se obtiene desde el archivo .env del backend.

Flujo:
Controller -> Service -> API de Gemini
============================================================
*/


/*
Crea un error y le agrega el código HTTP que utilizará
el controlador al responder al frontend.
*/
function crearError(mensaje, estado){

    const error =
        new Error(mensaje);

    error.status = estado;

    return error;
}


/*
Valida los datos recibidos antes de enviarlos a Gemini.

Se espera:
- tipo: "actividad" o "evento"
- nombre: nombre de la actividad o del evento
- categoria: opcional, solo aplica para actividades
- descripcion: el texto que se desea mejorar
*/
function validarDatos(datos){

    // Verifica que se haya enviado información
    if(!datos){

        throw crearError(
            "No se recibió información para mejorar.",
            400
        );
    }


    // Verifica el tipo
    if(
        datos.tipo !== "actividad" &&
        datos.tipo !== "evento"
    ){

        throw crearError(
            "El tipo debe ser actividad o evento.",
            400
        );
    }


    // Verifica el nombre
    if(
        typeof datos.nombre !== "string" ||
        datos.nombre.trim().length < 3
    ){

        throw crearError(
            "Debe indicar el nombre antes de solicitar la mejora.",
            400
        );
    }


    // Verifica la descripción
    if(
        typeof datos.descripcion !== "string" ||
        datos.descripcion.trim().length < 10
    ){

        throw crearError(
            "La descripción debe tener al menos 10 caracteres.",
            400
        );
    }


    // La categoría es opcional
    let categoria = "";

    if(typeof datos.categoria === "string"){

        categoria = datos.categoria.trim();
    }


    return {
        tipo: datos.tipo,
        nombre: datos.nombre.trim(),
        categoria: categoria,
        descripcion: datos.descripcion.trim()
    };
}


/*
Construye las instrucciones que se envían a Gemini.

El objetivo es mejorar la redacción sin inventar
información que el administrador no haya escrito.
*/
function construirPrompt(datos){

    // Palabra que se utilizará dentro del texto
    let palabraTipo = "la actividad";

    if(datos.tipo === "evento"){

        palabraTipo = "el evento";
    }


    // Línea opcional con la categoría
    let lineaCategoria = "";

    if(datos.categoria !== ""){

        lineaCategoria =
            "Categoría: " + datos.categoria + "\n";
    }


    const prompt =
        "Actúa como asistente de redacción para el sistema de eventos " +
        "de la Universidad CENFOTEC.\n\n" +

        "Mejora únicamente la redacción de la descripción de " +
        palabraTipo + ".\n\n" +

        "DATOS\n\n" +
        "Nombre: " + datos.nombre + "\n" +
        lineaCategoria + "\n" +

        "DESCRIPCIÓN ORIGINAL\n\n" +
        datos.descripcion + "\n\n" +

        "REGLAS\n\n" +
        "1. Escribe en español.\n" +
        "2. Conserva la idea original del administrador.\n" +
        "3. Corrige la ortografía, la puntuación y la gramática.\n" +
        "4. Mejora la claridad y utiliza un tono profesional y atractivo.\n" +
        "5. No inventes fechas, horarios, lugares, precios, cupos, " +
        "personas ni patrocinadores.\n" +
        "6. No agregues información que no esté en la descripción original.\n" +
        "7. Devuelve únicamente un párrafo mejorado.\n" +
        "8. No incluyas títulos, listas, comillas ni explicaciones.";


    return prompt;
}


/*
Extrae el texto generado por Gemini.

Se recorre la respuesta paso a paso para poder revisar
con claridad cada parte del objeto recibido.
*/
function obtenerTextoRespuesta(resultado){

    if(!resultado.candidates){

        return "";
    }

    if(resultado.candidates.length === 0){

        return "";
    }


    const candidato =
        resultado.candidates[0];


    if(!candidato.content){

        return "";
    }

    if(!candidato.content.parts){

        return "";
    }


    const partes =
        candidato.content.parts;

    let textoCompleto = "";


    for(let i = 0; i < partes.length; i++){

        if(typeof partes[i].text === "string"){

            textoCompleto =
                textoCompleto + partes[i].text;
        }
    }


    return textoCompleto.trim();
}


/*
Función principal del servicio.

1. Valida los datos recibidos.
2. Obtiene la clave y el modelo desde el .env.
3. Construye la solicitud.
4. Envía la petición a Gemini.
5. Procesa la respuesta.
*/
async function mejorarDescripcion(datosEntrada){

    // Valida y limpia los datos recibidos
    const datos =
        validarDatos(datosEntrada);


    // Obtiene la clave desde el archivo .env
    const claveApi =
        process.env.GEMINI_API_KEY;


    // Verifica que la clave esté configurada
    if(!claveApi){

        throw crearError(
            "La API de Gemini no está configurada en el servidor.",
            503
        );
    }


    // Obtiene el modelo desde el .env
    let modelo =
        process.env.GEMINI_MODEL;

    // Si no se configuró un modelo, utiliza uno por defecto
    if(!modelo){

        modelo = "gemini-3.6-flash";
    }


    // Cuerpo de la solicitud que espera Gemini
    const cuerpo = {

        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: construirPrompt(datos)
                    }
                ]
            }
        ],

        generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600
        }
    };


    // Dirección del modelo dentro de la API de Gemini
    const direccion =
        "https://generativelanguage.googleapis.com/" +
        "v1beta/models/" +
        encodeURIComponent(modelo) +
        ":generateContent";


    let respuesta;


    try{

        respuesta =
            await fetch(
                direccion,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "x-goog-api-key": claveApi
                    },

                    body: JSON.stringify(cuerpo)
                }
            );

    } catch(error){

        console.error(
            "Error de conexión con Gemini:",
            error
        );

        throw crearError(
            "No fue posible conectarse con Gemini.",
            503
        );
    }


    // Convierte la respuesta a JSON
    const resultado =
        await respuesta.json();


    // Verifica que Gemini haya aceptado la solicitud
    if(!respuesta.ok){

        console.error(
            "Respuesta de Gemini:",
            resultado
        );

        let mensajeError =
            "Gemini rechazó la solicitud.";

        if(
            resultado.error &&
            resultado.error.message
        ){

            mensajeError =
                resultado.error.message;
        }

        throw crearError(
            mensajeError,
            502
        );
    }


    // Obtiene el texto generado
    const descripcionMejorada =
        obtenerTextoRespuesta(resultado);


    // Verifica que Gemini haya devuelto contenido
    if(descripcionMejorada === ""){

        throw crearError(
            "Gemini no generó una descripción.",
            502
        );
    }


    return {
        descripcionOriginal: datos.descripcion,
        descripcionMejorada: descripcionMejorada,
        modelo: modelo
    };
}


// Exporta las funciones del servicio
module.exports = {
    mejorarDescripcion
};
