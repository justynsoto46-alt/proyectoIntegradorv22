// Importa la función genérica para enviar datos al backend
import {
    crearDatos
} from "../comunes/api.js";

// Dirección de la API de autenticación
const URL_AUTENTICACION =
    "/api/autenticacion";


// Función para iniciar sesión
export async function iniciarSesion(
    correo,
    contrasena
){

    // Crea el objeto con las credenciales
    const credenciales = {
        correo,
        contrasena
    };

    // Envía las credenciales al backend
    const resultado =
        await crearDatos(
            `${URL_AUTENTICACION}/iniciar-sesion`,
            credenciales
        );

    return resultado;
}