/*
============================================================
CONTROLADOR DE PARTICIPANTES
============================================================

Este archivo recibe las peticiones del navegador
y coordina la respuesta al frontend.

Aquí NO se accede directamente a MongoDB.

Flujo:
Route -> Controller -> Service -> DatosService -> MongoDB
============================================================
*/


// Importa las funciones del servicio de participantes
const {
    registrarParticipante: registrarParticipanteService,
    listarParticipantes: listarParticipantesService,
    consultarParticipantePorId:
        consultarParticipantePorIdService,
    modificarParticipante:
        modificarParticipanteService,
    eliminarParticipante:
        eliminarParticipanteService
} = require("../services/participanteService");


// Importa las funciones del modelo de participante
const {
    crearParticipante,
    crearDatosActualizacion
} = require("../models/participante");



/*
Función para registrar un participante.
*/
async function registrarParticipante(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;


        // Crea el participante utilizando
        // la estructura definida en el modelo
        const datosParticipante =
            crearParticipante(
                req.body
            );


        // Envía el participante al service.
        // El service se encarga de validar si
        // la identificación ya está registrada.
        const participanteGuardado =
            await registrarParticipanteService(
                baseDatos,
                datosParticipante
            );


        // Responde al frontend cuando
        // el registro fue exitoso
        res.status(201).json({

            mensaje:
                "Participante registrado correctamente.",

            idParticipante:
                participanteGuardado._id
        });

    } catch(error){

        console.error(
            "Error al registrar participante:",
            error
        );


        // Utiliza el código de estado generado
        // por el service cuando exista
        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo registrar el participante."
        });
    }
}



/*
Función para listar todos los participantes.
*/
async function listarParticipantes(req, res){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Solicita la lista al service
        const participantes =
            await listarParticipantesService(
                baseDatos
            );


        // Devuelve la lista al frontend
        res.status(200).json(
            participantes
        );

    } catch(error){

        console.error(
            "Error al listar participantes:",
            error
        );


        res.status(500).json({

            mensaje:
                "No se pudieron cargar los participantes."
        });
    }
}



/*
Función para consultar un participante
por su identificador de MongoDB.
*/
async function consultarParticipantePorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador enviado
        // como parámetro en la URL
        const idParticipante =
            req.params.id;


        // Solicita el participante al service
        const participante =
            await consultarParticipantePorIdService(
                baseDatos,
                idParticipante
            );


        // Devuelve el participante encontrado
        res.status(200).json(
            participante
        );

    } catch(error){

        console.error(
            "Error al consultar participante:",
            error
        );


        // El service puede devolver, por ejemplo:
        // 400 -> id inválido
        // 404 -> participante no encontrado
        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo consultar el participante."
        });
    }
}



/*
Función para modificar un participante.
*/
async function modificarParticipantePorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador
        const idParticipante =
            req.params.id;


        // Construye únicamente los campos
        // que pueden modificarse
        const datosActualizados =
            crearDatosActualizacion(
                req.body
            );


        // Solicita la modificación al service
        await modificarParticipanteService(
            baseDatos,
            idParticipante,
            datosActualizados
        );


        // Responde al frontend
        res.status(200).json({

            mensaje:
                "Participante modificado correctamente."
        });

    } catch(error){

        console.error(
            "Error al modificar participante:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo modificar el participante."
        });
    }
}



/*
Función para eliminar un participante.
*/
async function eliminarParticipantePorId(
    req,
    res
){

    try{

        // Obtiene la base de datos
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador
        const idParticipante =
            req.params.id;


        // Solicita la eliminación al service
        await eliminarParticipanteService(
            baseDatos,
            idParticipante
        );


        // Responde al frontend
        res.status(200).json({

            mensaje:
                "Participante eliminado correctamente."
        });

    } catch(error){

        console.error(
            "Error al eliminar participante:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo eliminar el participante."
        });
    }
}



// Exporta las funciones del controlador
module.exports = {
    registrarParticipante,
    listarParticipantes,
    consultarParticipantePorId,
    modificarParticipantePorId,
    eliminarParticipantePorId
};