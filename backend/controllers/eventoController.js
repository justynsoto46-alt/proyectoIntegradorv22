/*
============================================================
CONTROLADOR DE EVENTOS
============================================================

Este archivo recibe las peticiones del navegador
y coordina la respuesta al frontend.

Aquí NO se accede directamente a MongoDB.

Flujo:
Route -> Controller -> Service -> DatosService -> MongoDB
============================================================
*/


// Importa las funciones del servicio de eventos
const {
    registrarEvento: registrarEventoService,
    listarEventos: listarEventosService,
    consultarEventoPorId:
        consultarEventoPorIdService,
    modificarEvento:
        modificarEventoService,
    eliminarEvento:
        eliminarEventoService
} = require("../services/eventoService");


// Importa las funciones del modelo de evento
const {
    crearEvento,
    crearDatosActualizacion
} = require("../models/evento");



/*
Función para registrar un evento.
*/
async function registrarEvento(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;


        // Crea el evento utilizando
        // la estructura definida en el modelo
        const datosEvento =
            crearEvento(
                req.body
            );


        // Envía el evento al service
        const eventoGuardado =
            await registrarEventoService(
                baseDatos,
                datosEvento
            );


        // Responde al frontend
        res.status(201).json({

            mensaje:
                "Evento registrado correctamente.",

            idEvento:
                eventoGuardado._id
        });

    } catch(error){

        console.error(
            "Error al registrar evento:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo registrar el evento."
        });
    }
}



/*
Función para listar todos los eventos.
*/
async function listarEventos(req, res){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Solicita la lista al service
        const eventos =
            await listarEventosService(
                baseDatos
            );


        // Devuelve la lista al frontend
        res.status(200).json(
            eventos
        );

    } catch(error){

        console.error(
            "Error al listar eventos:",
            error
        );


        res.status(500).json({

            mensaje:
                "No se pudieron cargar los eventos."
        });
    }
}



/*
Función para consultar un evento
por su identificador.
*/
async function consultarEventoPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador enviado
        // como parámetro en la URL
        const idEvento =
            req.params.id;


        // Solicita el evento al service
        const evento =
            await consultarEventoPorIdService(
                baseDatos,
                idEvento
            );


        // Devuelve el evento encontrado
        res.status(200).json(
            evento
        );

    } catch(error){

        console.error(
            "Error al consultar evento:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo consultar el evento."
        });
    }
}



/*
Función para modificar un evento.
*/
async function modificarEventoPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador
        const idEvento =
            req.params.id;


        // Construye únicamente
        // los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(
                req.body
            );


        // Solicita la modificación al service
        await modificarEventoService(
            baseDatos,
            idEvento,
            datosActualizados
        );


        // Respuesta exitosa
        res.status(200).json({

            mensaje:
                "Evento modificado correctamente."
        });

    } catch(error){

        console.error(
            "Error al modificar evento:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo modificar el evento."
        });
    }
}



/*
Función para eliminar un evento.
*/
async function eliminarEventoPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador
        const idEvento =
            req.params.id;


        // Solicita la eliminación al service
        await eliminarEventoService(
            baseDatos,
            idEvento
        );


        // Responde al frontend
        res.status(200).json({

            mensaje:
                "Evento eliminado correctamente."
        });

    } catch(error){

        console.error(
            "Error al eliminar evento:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo eliminar el evento."
        });
    }
}



// Exporta las funciones del controlador
module.exports = {
    registrarEvento,
    listarEventos,
    consultarEventoPorId,
    modificarEventoPorId,
    eliminarEventoPorId
};