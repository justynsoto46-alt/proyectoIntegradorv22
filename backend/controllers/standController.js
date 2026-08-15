/*
============================================================
CONTROLADOR DE STANDS
============================================================

Este archivo recibe las peticiones del navegador
y coordina la respuesta al frontend.

Aquí NO se accede directamente a MongoDB.

Flujo:
Route -> Controller -> Service -> DatosService -> MongoDB
============================================================
*/


// Importa las funciones del servicio de stands
const {
    registrarStand: registrarStandService,
    listarStands: listarStandsService,
    consultarStandPorId:
        consultarStandPorIdService,
    modificarStand:
        modificarStandService,
    eliminarStand:
        eliminarStandService
} = require("../services/standService");


// Importa las funciones del modelo de stand
const {
    crearStand,
    crearDatosActualizacion
} = require("../models/stand");


/*
Función para registrar un stand.
*/
async function registrarStand(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;

        // Crea el stand utilizando
        // la estructura definida en el modelo
        const datosStand =
            crearStand(
                req.body
            );

        // Envía el stand al service
        const standGuardado =
            await registrarStandService(
                baseDatos,
                datosStand
            );

        // Responde al frontend
        res.status(201).json({

            mensaje:
                "Stand registrado correctamente.",

            idStand:
                standGuardado._id
        });

    } catch(error){

        console.error(
            "Error al registrar stand:",
            error
        );

        const estado =
            error.status || 500;

        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo registrar el stand."
        });
    }
}


/*
Función para listar todos los stands.
*/
async function listarStands(req, res){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;

        // Solicita la lista al service
        const stands =
            await listarStandsService(
                baseDatos
            );

        // Devuelve la lista al frontend
        res.status(200).json(
            stands
        );

    } catch(error){

        console.error(
            "Error al listar stands:",
            error
        );

        res.status(500).json({

            mensaje:
                "No se pudieron cargar los stands."
        });
    }
}


/*
Función para consultar un stand
por su identificador.
*/
async function consultarStandPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;

        // Obtiene el identificador enviado
        // como parámetro en la URL
        const idStand =
            req.params.id;

        // Solicita el stand al service
        const stand =
            await consultarStandPorIdService(
                baseDatos,
                idStand
            );

        // Devuelve el stand encontrado
        res.status(200).json(
            stand
        );

    } catch(error){

        console.error(
            "Error al consultar stand:",
            error
        );

        const estado =
            error.status || 500;

        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo consultar el stand."
        });
    }
}


/*
Función para modificar un stand.
*/
async function modificarStandPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;

        // Obtiene el identificador
        const idStand =
            req.params.id;

        // Construye únicamente
        // los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(
                req.body
            );

        // Solicita la modificación al service
        await modificarStandService(
            baseDatos,
            idStand,
            datosActualizados
        );

        // Respuesta exitosa
        res.status(200).json({

            mensaje:
                "Stand modificado correctamente."
        });

    } catch(error){

        console.error(
            "Error al modificar stand:",
            error
        );

        const estado =
            error.status || 500;

        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo modificar el stand."
        });
    }
}


/*
Función para eliminar un stand.
*/
async function eliminarStandPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;

        // Obtiene el identificador
        const idStand =
            req.params.id;

        // Solicita la eliminación al service
        await eliminarStandService(
            baseDatos,
            idStand
        );

        // Responde al frontend
        res.status(200).json({

            mensaje:
                "Stand eliminado correctamente."
        });

    } catch(error){

        console.error(
            "Error al eliminar stand:",
            error
        );

        const estado =
            error.status || 500;

        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo eliminar el stand."
        });
    }
}


// Exporta las funciones del controlador
module.exports = {
    registrarStand,
    listarStands,
    consultarStandPorId,
    modificarStandPorId,
    eliminarStandPorId
};