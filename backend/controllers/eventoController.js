// Recibe las peticiones del navegador para eventos.

// Importa las funciones del servicio de eventos
const {
    insertarEvento,
    obtenerEventos,
    obtenerEventoPorId,
    modificarEvento,
    eliminarEvento
} = require("../services/eventoService");

// Importa las funciones del modelo de evento
const {
    crearEvento,
    crearDatosActualizacion
} = require("../models/evento");


// Función para registrar el evento
async function registrarEvento(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos = req.app.locals.baseDatos;

        // Crea el evento utilizando la estructura del modelo
        const datosEvento = crearEvento(req.body);

        // Envía los datos al servicio para guardarlos en MongoDB
        const resultado = await insertarEvento(
            baseDatos,
            datosEvento
        );

        res.status(201).json({
            mensaje: "Evento registrado correctamente.",
            idEvento: resultado.insertedId
        });

    } catch(error){

        console.error("Error al registrar evento:", error);

        res.status(500).json({
            mensaje: "No se pudo registrar el evento."
        });
    }
}

// Función para listar todos los eventos
async function listarEventos(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const eventos = await obtenerEventos(baseDatos);

        res.status(200).json(eventos);

    } catch(error){

        console.error("Error al listar eventos:", error);

        res.status(500).json({
            mensaje: "No se pudieron cargar los eventos."
        });
    }
}

// Función para consultar el evento por su identificador
async function consultarEventoPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idEvento = req.params.id;

        const evento = await obtenerEventoPorId(
            baseDatos,
            idEvento
        );

        if(evento === null){

            return res.status(404).json({
                mensaje: "No se encontró el evento."
            });
        }

        res.status(200).json(evento);

    } catch(error){

        console.error("Error al consultar evento:", error);

        res.status(500).json({
            mensaje: "No se pudo consultar el evento."
        });
    }
}

// Función para modificar el evento
async function modificarEventoPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idEvento = req.params.id;

        // Construye únicamente los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(req.body);

        const resultado = await modificarEvento(
            baseDatos,
            idEvento,
            datosActualizados
        );

        // Verifica si el identificador era válido
        if(resultado === null){

            return res.status(400).json({
                mensaje:
                    "El identificador del evento no es válido."
            });
        }

        if(resultado.matchedCount === 0){

            return res.status(404).json({
                mensaje: "No se encontró el evento."
            });
        }

        res.status(200).json({
            mensaje: "Evento modificado correctamente."
        });

    } catch(error){

        console.error("Error al modificar evento:", error);

        res.status(500).json({
            mensaje: "No se pudo modificar el evento."
        });
    }
}

// Función para eliminar el evento
async function eliminarEventoPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idEvento = req.params.id;

        const resultado = await eliminarEvento(
            baseDatos,
            idEvento
        );

        // Verifica si el identificador era válido
        if(resultado === null){

            return res.status(400).json({
                mensaje:
                    "El identificador del evento no es válido."
            });
        }

        if(resultado.deletedCount === 0){

            return res.status(404).json({
                mensaje: "No se encontró el evento."
            });
        }

        res.status(200).json({
            mensaje: "Evento eliminado correctamente."
        });

    } catch(error){

        console.error("Error al eliminar evento:", error);

        res.status(500).json({
            mensaje: "No se pudo eliminar el evento."
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
