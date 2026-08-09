// Importa la función genérica para enviar datos al backend
import {
    crearDatos
} from "../comunes/api.js";

// Dirección de la API para modificar contraseña
const URL_CONTRASENA =
    "/api/contrasena";


// Función para modificar la contraseña de un administrador
export async function modificarContrasena(
    correo,
    nuevaContrasena
){

    // Crea el objeto con los datos necesarios
    const datos = {
        correo,
        nuevaContrasena
    };

    // Envía los datos al backend
    const resultado =
        await crearDatos(
            `${URL_CONTRASENA}/modificar`,
            datos
        );

    return resultado;
}