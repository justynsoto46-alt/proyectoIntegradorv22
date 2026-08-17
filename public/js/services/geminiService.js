// Importa la función genérica para comunicarse con el backend
import {
    crearDatos
} from "../comunes/api.js";

// Dirección base de la API de Gemini
const URL_GEMINI =
    "/api/gemini";


// Función para solicitar una descripción mejorada.
//
// Recibe un objeto con:
// - tipo: "actividad" o "evento"
// - nombre: nombre de la actividad o del evento
// - categoria: opcional, solo aplica para actividades
// - descripcion: el texto que se desea mejorar
export async function mejorarDescripcion(datos){

    return await crearDatos(
        `${URL_GEMINI}/mejorar-descripcion`,
        datos
    );
}
