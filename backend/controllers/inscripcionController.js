/*
============================================================
CONTROLADOR DE INSCRIPCIONES
============================================================

Este archivo recibe las peticiones relacionadas
con las inscripciones a actividades.

Aquí NO se accede directamente a MongoDB.

Flujo:
Route -> Controller -> Service -> DatosService -> MongoDB
============================================================
*/


// Importa las funciones del servicio de inscripciones
const {
    registrarInscripcion: registrarInscripcionService,

    listarInscripcionesPorParticipante:
        listarInscripcionesPorParticipanteService,

    listarInscripcionesPorActividad:
        listarInscripcionesPorActividadService,

    buscarInscripcionesPorIdentificacion:
        buscarInscripcionesPorIdentificacionService,

    eliminarInscripcion:
        eliminarInscripcionService

} = require("../services/inscripcionService");


// Importa la función para crear
// la estructura de una inscripción
const {
    crearInscripcion
} = require("../models/inscripcion");


/*
Función para registrar una inscripción.
*/
async function registrarInscripcion(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;


        // Verifica que se hayan recibido
        // los datos necesarios
        const {
            participanteId,
            actividadId
        } = req.body;


        if(!participanteId || !actividadId){

            return res.status(400).json({

                mensaje:
                    "Debe indicar el participante y la actividad."
            });
        }


        // Construye la inscripción utilizando
        // la estructura definida en el modelo
        const datosInscripcion =
            crearInscripcion(
                req.body
            );


        // Envía la inscripción al service
        const inscripcionGuardada =
            await registrarInscripcionService(
                baseDatos,
                datosInscripcion
            );


        // Respuesta exitosa
        res.status(201).json({

            mensaje:
                "Inscripción registrada correctamente.",

            idInscripcion:
                inscripcionGuardada._id
        });

    } catch(error){

        console.error(
            "Error al registrar inscripción:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo registrar la inscripción."
        });
    }
}


/*
Función para consultar las inscripciones
de un participante.
*/
async function listarInscripcionesPorParticipante(
    req,
    res
){

    try{

        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador del participante
        // enviado en la dirección
        const participanteId =
            req.params.participanteId;


        const inscripciones =
            await listarInscripcionesPorParticipanteService(
                baseDatos,
                participanteId
            );


        res.status(200).json(
            inscripciones
        );

    } catch(error){

        console.error(
            "Error al consultar inscripciones del participante:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudieron consultar las inscripciones."
        });
    }
}


/*
Función para consultar las inscripciones
de una actividad.
*/
async function listarInscripcionesPorActividad(
    req,
    res
){

    try{

        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador de la actividad
        const actividadId =
            req.params.actividadId;


        const inscripciones =
            await listarInscripcionesPorActividadService(
                baseDatos,
                actividadId
            );


        res.status(200).json(
            inscripciones
        );

    } catch(error){

        console.error(
            "Error al consultar inscripciones de la actividad:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudieron consultar las inscripciones."
        });
    }
}

/*
Busca un participante por su identificación
y devuelve todas sus inscripciones.
*/
async function buscarInscripcionesPorIdentificacion(
    req,
    res
){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene la identificación enviada
        // como parte de la dirección
        const identificacion =
            req.params.identificacion;


        // Verifica que se haya recibido
        // una identificación
        if(!identificacion){

            return res.status(400).json({

                mensaje:
                    "Debe ingresar la identificación del participante."
            });
        }


        // Solicita al service buscar al participante
        // y todas sus inscripciones
        const resultado =
            await buscarInscripcionesPorIdentificacionService(
                baseDatos,
                identificacion
            );


        // Devuelve la información encontrada
        res.status(200).json(
            resultado
        );

    } catch(error){

        console.error(
            "Error al buscar inscripciones por identificación:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudieron consultar las inscripciones."
        });
    }
}

/*
Función para eliminar una inscripción.
*/
async function eliminarInscripcionPorId(
    req,
    res
){

    try{

        const baseDatos =
            req.app.locals.baseDatos;


        // Obtiene el identificador de la inscripción
        const idInscripcion =
            req.params.id;


        // Solicita la eliminación al service
        await eliminarInscripcionService(
            baseDatos,
            idInscripcion
        );


        // Respuesta exitosa
        res.status(200).json({

            mensaje:
                "Inscripción cancelada correctamente."
        });

    } catch(error){

        console.error(
            "Error al cancelar inscripción:",
            error
        );


        const estado =
            error.status || 500;


        res.status(estado).json({

            mensaje:
                error.message ||
                "No se pudo cancelar la inscripción."
        });
    }
}


// Exporta las funciones del controlador
module.exports = {
    registrarInscripcion,
    listarInscripcionesPorParticipante,
    listarInscripcionesPorActividad,
    buscarInscripcionesPorIdentificacion,
    eliminarInscripcionPorId
};