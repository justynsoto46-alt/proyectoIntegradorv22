// Importa las funciones genéricas para comunicarse con el backend
import {
    crearDatos,
    obtenerDatos,
    actualizarDatos,
    eliminarDatos
} from "../comunes/api.js";

// Dirección base de la API de stands
const URL_STANDS = "/api/stands";


// Función para registrar un stand
export async function registrarStand(stand){

    return await crearDatos(
        URL_STANDS,
        stand.obtenerDatosParaGuardar()
    );
}


// Función para obtener todos los stands
export async function obtenerStands(){

    return await obtenerDatos(
        URL_STANDS
    );
}


// Función para obtener un stand por su identificador
export async function obtenerStandPorId(idStand){

    return await obtenerDatos(
        `${URL_STANDS}/${idStand}`
    );
}


// Función para modificar un stand
export async function modificarStand(
    idStand,
    stand
){

    return await actualizarDatos(
        `${URL_STANDS}/${idStand}`,
        stand.obtenerDatosParaModificar()
    );
}


// Función para eliminar un stand
export async function eliminarStand(idStand){

    return await eliminarDatos(
        `${URL_STANDS}/${idStand}`
    );
}