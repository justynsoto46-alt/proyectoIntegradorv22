// Recibe las peticiones del navegador para actividades.

// Importa las funciones del servicio de actividades
const {
    insertarActividad,
    obtenerActividades,
    obtenerActividadPorId,
    modificarActividad,
    eliminarActividad
} = require("../services/actividadService");

// Importa las funciones del modelo de actividad
const {
    crearActividad,
    crearDatosActualizacion
} = require("../models/actividad");


// Función para registrar la actividad
async function registrarActividad(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos = req.app.locals.baseDatos;

        // Crea la actividad utilizando la estructura del modelo
        const datosActividad = crearActividad(req.body);

        // Envía los datos al servicio para guardarlos en MongoDB
        const resultado = await insertarActividad(
            baseDatos,
            datosActividad
        );

        res.status(201).json({
            mensaje: "Actividad registrada correctamente.",
            idActividad: resultado.insertedId
        });

    } catch(error){

        console.error("Error al registrar actividad:", error);

        res.status(500).json({
            mensaje: "No se pudo registrar la actividad."
        });
    }
}

// Función para listar todas las actividades
async function listarActividades(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const actividades = await obtenerActividades(baseDatos);

        res.status(200).json(actividades);

    } catch(error){

        console.error("Error al listar actividades:", error);

        res.status(500).json({
            mensaje: "No se pudieron cargar las actividades."
        });
    }
}

// Función para consultar la actividad por su identificador
async function consultarActividadPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idActividad = req.params.id;

        const actividad = await obtenerActividadPorId(
            baseDatos,
            idActividad
        );

        if(actividad === null){

            return res.status(404).json({
                mensaje: "No se encontró la actividad."
            });
        }

        res.status(200).json(actividad);

    } catch(error){

        console.error("Error al consultar actividad:", error);

        res.status(500).json({
            mensaje: "No se pudo consultar la actividad."
        });
    }
}

// Función para modificar la actividad
async function modificarActividadPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idActividad = req.params.id;

        // Construye únicamente los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(req.body);

        const resultado = await modificarActividad(
            baseDatos,
            idActividad,
            datosActualizados
        );

        // Verifica si el identificador era válido
        if(resultado === null){

            return res.status(400).json({
                mensaje:
                    "El identificador de la actividad no es válido."
            });
        }

        if(resultado.matchedCount === 0){

            return res.status(404).json({
                mensaje: "No se encontró la actividad."
            });
        }

        res.status(200).json({
            mensaje: "Actividad modificada correctamente."
        });

    } catch(error){

        console.error("Error al modificar actividad:", error);

        res.status(500).json({
            mensaje: "No se pudo modificar la actividad."
        });
    }
}

// Función para eliminar la actividad
async function eliminarActividadPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idActividad = req.params.id;

        const resultado = await eliminarActividad(
            baseDatos,
            idActividad
        );

        // Verifica si el identificador era válido
        if(resultado === null){

            return res.status(400).json({
                mensaje:
                    "El identificador de la actividad no es válido."
            });
        }

        if(resultado.deletedCount === 0){

            return res.status(404).json({
                mensaje: "No se encontró la actividad."
            });
        }

        res.status(200).json({
            mensaje: "Actividad eliminada correctamente."
        });

    } catch(error){

        console.error("Error al eliminar actividad:", error);

        res.status(500).json({
            mensaje: "No se pudo eliminar la actividad."
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
