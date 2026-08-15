/*
============================================================
CONTROLADOR DE ADMINISTRADORES
============================================================

Este archivo recibe las peticiones del navegador
y coordina la respuesta al frontend.

Aquí NO se accede directamente a MongoDB.

Flujo:
Route -> Controller -> Service -> DatosService -> MongoDB
============================================================
*/


// Importa las funciones del servicio de administradores
const {
    registrarAdministrador: registrarAdministradorService,
    listarAdministradores: listarAdministradoresService,
    consultarAdministradorPorId:
        consultarAdministradorPorIdService,
    modificarAdministrador:
        modificarAdministradorService,
    eliminarAdministrador:
        eliminarAdministradorService
} = require("../services/administradorService");


// Importa las funciones del modelo de administrador
const {
    crearAdministrador,
    crearDatosActualizacion
} = require("../models/administrador");



/*
Función para registrar un administrador.
*/
async function registrarAdministrador(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;


        // Crea el administrador utilizando
        // la estructura definida en el modelo
        const datosAdministrador =
            crearAdministrador(
                req.body
            );


        // Envía el administrador al service.
        // El service valida si el correo ya existe.
        const administradorGuardado =
            await registrarAdministradorService(
                baseDatos,
                datosAdministrador
            );


        // Responde al frontend
        res.status(201).json({

            mensaje:
                "Administrador registrado correctamente.",

            idAdministrador:
                administradorGuardado._id
        });

    } catch(error){

        console.error(
            "Error al registrar administrador:",
            error
        );


        // Utiliza el estado definido por el service
        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo registrar el administrador."
        });
    }
}



/*
Función para listar todos los administradores.
*/
async function listarAdministradores(req, res){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Solicita la lista al service
        const administradores =
            await listarAdministradoresService(
                baseDatos
            );


        // Devuelve la lista al frontend
        res.status(200).json(
            administradores
        );

    } catch(error){

        console.error(
            "Error al listar administradores:",
            error
        );


        res.status(500).json({

            mensaje:
                "No se pudieron cargar los administradores."
        });
    }
}



/*
Función para consultar un administrador
por su identificador.
*/
async function consultarAdministradorPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador enviado
        // como parámetro en la URL
        const idAdministrador =
            req.params.id;


        // Solicita el administrador al service
        const administrador =
            await consultarAdministradorPorIdService(
                baseDatos,
                idAdministrador
            );


        // Devuelve el administrador encontrado
        res.status(200).json(
            administrador
        );

    } catch(error){

        console.error(
            "Error al consultar administrador:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo consultar el administrador."
        });
    }
}



/*
Función para modificar un administrador.
*/
async function modificarAdministradorPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador
        const idAdministrador =
            req.params.id;


        // Construye únicamente
        // los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(
                req.body
            );


        // Solicita la modificación al service
        await modificarAdministradorService(
            baseDatos,
            idAdministrador,
            datosActualizados
        );


        // Respuesta exitosa
        res.status(200).json({

            mensaje:
                "Administrador modificado correctamente."
        });

    } catch(error){

        console.error(
            "Error al modificar administrador:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo modificar el administrador."
        });
    }
}



/*
Función para eliminar un administrador.
*/
async function eliminarAdministradorPorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador
        const idAdministrador =
            req.params.id;


        // Solicita la eliminación al service
        await eliminarAdministradorService(
            baseDatos,
            idAdministrador
        );


        // Responde al frontend
        res.status(200).json({

            mensaje:
                "Administrador eliminado correctamente."
        });

    } catch(error){

        console.error(
            "Error al eliminar administrador:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo eliminar el administrador."
        });
    }
}



// Exporta las funciones del controlador
module.exports = {
    registrarAdministrador,
    listarAdministradores,
    consultarAdministradorPorId,
    modificarAdministradorPorId,
    eliminarAdministradorPorId
};