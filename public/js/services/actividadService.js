// Importa las funciones genéricas para comunicarse con el backend
import {
    crearDatos,
    obtenerDatos,
    actualizarDatos,
    eliminarDatos
} from "../comunes/api.js";

// Dirección base de la API de actividades
const URL_ACTIVIDADES = "/api/actividades";


// Función para registrar una actividad
export async function registrarActividad(actividad){

    return await crearDatos(
        URL_ACTIVIDADES,
        actividad.obtenerDatosParaGuardar()
    );
}


// Función para obtener todas las actividades
export async function obtenerActividades(){

    return await obtenerDatos(
        URL_ACTIVIDADES
    );
}


// Función para obtener una actividad por su identificador
export async function obtenerActividadPorId(idActividad){

    return await obtenerDatos(
        `${URL_ACTIVIDADES}/${idActividad}`
    );
}


// Función para modificar una actividad
export async function modificarActividad(
    idActividad,
    actividad
){

    return await actualizarDatos(
        `${URL_ACTIVIDADES}/${idActividad}`,
        actividad.obtenerDatosParaModificar()
    );
}


// Función para eliminar una actividad
export async function eliminarActividad(idActividad){

    return await eliminarDatos(
        `${URL_ACTIVIDADES}/${idActividad}`
    );
}