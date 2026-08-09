// Importa las funciones genéricas para comunicarse con el backend
import {
    crearDatos,
    obtenerDatos,
    actualizarDatos,
    eliminarDatos
} from "../comunes/api.js";

// Dirección base de la API de eventos
const URL_EVENTOS = "/api/eventos";


// Función para registrar un evento
export async function registrarEvento(evento){

    return await crearDatos(
        URL_EVENTOS,
        evento.obtenerDatosParaGuardar()
    );
}


// Función para obtener todos los eventos
export async function obtenerEventos(){

    return await obtenerDatos(
        URL_EVENTOS
    );
}


// Función para obtener un evento por su identificador
export async function obtenerEventoPorId(idEvento){

    return await obtenerDatos(
        `${URL_EVENTOS}/${idEvento}`
    );
}


// Función para modificar un evento
export async function modificarEvento(
    idEvento,
    evento
){

    return await actualizarDatos(
        `${URL_EVENTOS}/${idEvento}`,
        evento.obtenerDatosParaModificar()
    );
}


// Función para eliminar un evento
export async function eliminarEvento(idEvento){

    return await eliminarDatos(
        `${URL_EVENTOS}/${idEvento}`
    );
}