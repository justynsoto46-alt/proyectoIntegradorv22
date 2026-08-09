// Importa las funciones genéricas para comunicarse con el backend
import {
    crearDatos,
    obtenerDatos,
    actualizarDatos,
    eliminarDatos
} from "../comunes/api.js";

// Dirección base de la API de responsables
const URL_RESPONSABLES = "/api/responsables";


// Función para registrar un responsable
export async function registrarResponsable(responsable){

    return await crearDatos(
        URL_RESPONSABLES,
        responsable.obtenerDatosParaGuardar()
    );
}


// Función para obtener todos los responsables
export async function obtenerResponsables(){

    return await obtenerDatos(
        URL_RESPONSABLES
    );
}


// Función para obtener un responsable por su identificador
export async function obtenerResponsablePorId(idResponsable){

    return await obtenerDatos(
        `${URL_RESPONSABLES}/${idResponsable}`
    );
}


// Función para modificar un responsable
export async function modificarResponsable(
    idResponsable,
    responsable
){

    return await actualizarDatos(
        `${URL_RESPONSABLES}/${idResponsable}`,
        responsable.obtenerDatosParaModificar()
    );
}


// Función para eliminar un responsable
export async function eliminarResponsable(idResponsable){

    return await eliminarDatos(
        `${URL_RESPONSABLES}/${idResponsable}`
    );
}