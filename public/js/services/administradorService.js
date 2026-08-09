// Importa las funciones genéricas para comunicarse con el backend
import {
    crearDatos,
    obtenerDatos,
    actualizarDatos,
    eliminarDatos
} from "../comunes/api.js";

// Dirección base de la API de administradores
const URL_ADMINISTRADORES =
    "/api/administradores";


// Función para registrar un administrador
export async function registrarAdministrador(administrador){

    return await crearDatos(
        URL_ADMINISTRADORES,
        administrador.obtenerDatosParaGuardar()
    );
}


// Función para obtener todos los administradores
export async function obtenerAdministradores(){

    return await obtenerDatos(
        URL_ADMINISTRADORES
    );
}


// Función para obtener un administrador por su identificador
export async function obtenerAdministradorPorId(idAdministrador){

    return await obtenerDatos(
        `${URL_ADMINISTRADORES}/${idAdministrador}`
    );
}


// Función para modificar un administrador
export async function modificarAdministrador(
    idAdministrador,
    administrador
){

    return await actualizarDatos(
        `${URL_ADMINISTRADORES}/${idAdministrador}`,
        administrador.obtenerDatosParaModificar()
    );
}


// Función para eliminar un administrador
export async function eliminarAdministrador(idAdministrador){

    return await eliminarDatos(
        `${URL_ADMINISTRADORES}/${idAdministrador}`
    );
}