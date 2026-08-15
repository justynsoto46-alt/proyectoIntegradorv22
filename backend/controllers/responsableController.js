/*
============================================================
CONTROLADOR DE RESPONSABLES
============================================================

Este archivo recibe las peticiones del navegador
y coordina la respuesta al frontend.

Aquí NO se accede directamente a MongoDB.

Flujo:
Route -> Controller -> Service -> DatosService -> MongoDB
============================================================
*/


// Importa las funciones del servicio de responsables
const {
    registrarResponsable: registrarResponsableService,
    listarResponsables: listarResponsablesService,
    consultarResponsablePorId:
        consultarResponsablePorIdService,
    modificarResponsable:
        modificarResponsableService,
    eliminarResponsable:
        eliminarResponsableService
} = require("../services/responsableService");


// Importa las funciones del modelo de responsable
const {
    crearResponsable,
    crearDatosActualizacion
} = require("../models/responsable");



/*
Función para registrar un responsable.
*/
async function registrarResponsable(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;


        // Crea el responsable utilizando
        // la estructura definida en el modelo
        const datosResponsable =
            crearResponsable(
                req.body
            );


        // Envía el responsable al service.
        // El service valida si el correo ya existe.
        const responsableGuardado =
            await registrarResponsableService(
                baseDatos,
                datosResponsable
            );


        // Responde al frontend
        res.status(201).json({

            mensaje:
                "Responsable registrado correctamente.",

            idResponsable:
                responsableGuardado._id
        });

    } catch(error){

        console.error(
            "Error al registrar responsable:",
            error
        );


        // Usa el estado definido por el service,
        // si existe
        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo registrar el responsable."
        });
    }
}



/*
Función para listar todos los responsables.
*/
async function listarResponsables(req, res){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Solicita la lista al service
        const responsables =
            await listarResponsablesService(
                baseDatos
            );


        // Devuelve los responsables al frontend
        res.status(200).json(
            responsables
        );

    } catch(error){

        console.error(
            "Error al listar responsables:",
            error
        );


        res.status(500).json({

            mensaje:
                "No se pudieron cargar los responsables."
        });
    }
}



/*
Función para consultar un responsable
por su identificador.
*/
async function consultarResponsablePorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador enviado
        // como parámetro en la URL
        const idResponsable =
            req.params.id;


        // Solicita el responsable al service
        const responsable =
            await consultarResponsablePorIdService(
                baseDatos,
                idResponsable
            );


        // Devuelve el responsable encontrado
        res.status(200).json(
            responsable
        );

    } catch(error){

        console.error(
            "Error al consultar responsable:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo consultar el responsable."
        });
    }
}



/*
Función para modificar un responsable.
*/
async function modificarResponsablePorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador
        const idResponsable =
            req.params.id;


        // Construye únicamente
        // los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(
                req.body
            );


        // Solicita la modificación al service
        await modificarResponsableService(
            baseDatos,
            idResponsable,
            datosActualizados
        );


        // Respuesta exitosa
        res.status(200).json({

            mensaje:
                "Responsable modificado correctamente."
        });

    } catch(error){

        console.error(
            "Error al modificar responsable:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo modificar el responsable."
        });
    }
}



/*
Función para eliminar un responsable.
*/
async function eliminarResponsablePorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador
        const idResponsable =
            req.params.id;


        // Solicita la eliminación al service
        await eliminarResponsableService(
            baseDatos,
            idResponsable
        );


        // Responde al frontend
        res.status(200).json({

            mensaje:
                "Responsable eliminado correctamente."
        });

    } catch(error){

        console.error(
            "Error al eliminar responsable:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo eliminar el responsable."
        });
    }
}



// Exporta las funciones del controlador
module.exports = {
    registrarResponsable,
    listarResponsables,
    consultarResponsablePorId,
    modificarResponsablePorId,
    eliminarResponsablePorId
};