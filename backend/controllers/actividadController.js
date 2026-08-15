/*
============================================================
CONTROLADOR DE ACTIVIDADES
============================================================

Este archivo recibe las peticiones del navegador
y coordina la respuesta al frontend.

Aquí NO se accede directamente a MongoDB.

Flujo:
Route -> Controller -> Service -> DatosService -> MongoDB
============================================================
*/


// Importa las funciones del servicio de actividades
const {
    registrarActividad: registrarActividadService,
    listarActividades: listarActividadesService,
    consultarActividadPorId:
        consultarActividadPorIdService,
    modificarActividad:
        modificarActividadService,
    eliminarActividad:
        eliminarActividadService
} = require("../services/actividadService");


// Importa las funciones del modelo de actividad
const {
    crearActividad,
    crearDatosActualizacion
} = require("../models/actividad");


/*
Función para registrar una actividad.
*/
async function registrarActividad(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;

        // Crea la actividad utilizando
        // la estructura definida en el modelo
        const datosActividad =
            crearActividad(
                req.body
            );

        // Envía la actividad al service
        const actividadGuardada =
            await registrarActividadService(
                baseDatos,
                datosActividad
            );

        // Responde al frontend
        res.status(201).json({

            mensaje:
                "Actividad registrada correctamente.",

            idActividad:
                actividadGuardada._id
        });

    } catch(error){

        console.error(
            "Error al registrar actividad:",
            error
        );

        const estado =
            error.status || 500;

        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo registrar la actividad."
        });
    }
}


/*
Función para listar todas las actividades.
*/
async function listarActividades(req, res){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;

        // Solicita la lista al service
        const actividades =
            await listarActividadesService(
                baseDatos
            );

        // Devuelve la lista al frontend
        res.status(200).json(
            actividades
        );

    } catch(error){

        console.error(
            "Error al listar actividades:",
            error
        );

        res.status(500).json({

            mensaje:
                "No se pudieron cargar las actividades."
        });
    }
}


/*
Función para consultar una actividad
por su identificador.
*/
async function consultarActividadPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;

        // Obtiene el identificador enviado
        // como parámetro en la URL
        const idActividad =
            req.params.id;

        // Solicita la actividad al service
        const actividad =
            await consultarActividadPorIdService(
                baseDatos,
                idActividad
            );

        // Devuelve la actividad encontrada
        res.status(200).json(
            actividad
        );

    } catch(error){

        console.error(
            "Error al consultar actividad:",
            error
        );

        const estado =
            error.status || 500;

        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo consultar la actividad."
        });
    }
}


/*
Función para modificar una actividad.
*/
async function modificarActividadPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;

        // Obtiene el identificador
        const idActividad =
            req.params.id;

        // Construye únicamente
        // los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(
                req.body
            );

        // Solicita la modificación al service
        await modificarActividadService(
            baseDatos,
            idActividad,
            datosActualizados
        );

        // Respuesta exitosa
        res.status(200).json({

            mensaje:
                "Actividad modificada correctamente."
        });

    } catch(error){

        console.error(
            "Error al modificar actividad:",
            error
        );

        const estado =
            error.status || 500;

        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo modificar la actividad."
        });
    }
}


/*
Función para eliminar una actividad.
*/
async function eliminarActividadPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;

        // Obtiene el identificador
        const idActividad =
            req.params.id;

        // Solicita la eliminación al service
        await eliminarActividadService(
            baseDatos,
            idActividad
        );

        // Responde al frontend
        res.status(200).json({

            mensaje:
                "Actividad eliminada correctamente."
        });

    } catch(error){

        console.error(
            "Error al eliminar actividad:",
            error
        );

        const estado =
            error.status || 500;

        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo eliminar la actividad."
        });
    }
}


// Exporta las funciones del controlador
module.exports = {
    registrarActividad,
    listarActividades,
    consultarActividadPorId,
    modificarActividadPorId,
    eliminarActividadPorId
};