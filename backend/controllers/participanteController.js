// Será quien reciba la petición del navegador.

// Importa la función del servicio de participantes
const {
    insertarParticipante,
    obtenerParticipantes,
    obtenerParticipantePorId,
    obtenerParticipantePorIdentificacion,
    modificarParticipante,
    eliminarParticipante
} = require("../services/participanteService");

// Importa la función para crear el modelo de participante
const {
    crearParticipante,
    crearDatosActualizacion
} = require("../models/participante");


// Función para registrar un participante
async function registrarParticipante(req, res) {

    try {

        // Obtiene la base de datos guardada en Express
        const baseDatos = req.app.locals.baseDatos;

        // Crea el participante utilizando la estructura del modelo
        const datosParticipante = crearParticipante(req.body);

        // Verifica si ya existe un participante con la misma identificación
        const participanteExistente =
            await obtenerParticipantePorIdentificacion(
                baseDatos,
                datosParticipante.identificacion
            );

        if (participanteExistente !== null) {

            return res.status(409).json({
                mensaje:
                    "Ya existe un participante registrado con esta identificación."
            });
        }

        // Envía los datos al servicio para guardarlos en MongoDB
        const resultado = await insertarParticipante(
            baseDatos,
            datosParticipante
        );

        // Responde al navegador indicando que el registro fue exitoso
        res.status(201).json({
            mensaje: "Participante registrado correctamente.",
            idParticipante: resultado.insertedId
        });

    } catch (error) {

        console.error("Error al registrar participante:", error);

        res.status(500).json({
            mensaje: "No se pudo registrar el participante."
        });
    }
}

// Función para listar todos los participantes
async function listarParticipantes(req, res) {

    try {

        // Obtiene la conexión a la base de datos
        const baseDatos = req.app.locals.baseDatos;

        // Consulta los participantes por medio del servicio
        const participantes =
            await obtenerParticipantes(baseDatos);

        // Devuelve la lista al frontend
        res.status(200).json(participantes);

    } catch (error) {

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

// Función para consultar un participante por su identificador
async function consultarParticipantePorId(req, res) {

    try {

        // Obtiene la conexión a la base de datos
        const baseDatos = req.app.locals.baseDatos;

        // Obtiene el identificador enviado en la dirección
        const idParticipante = req.params.id;

        // Busca el participante mediante el servicio
        const participante =
            await obtenerParticipantePorId(
                baseDatos,
                idParticipante
            );

        // Verifica si el participante existe
        if (participante === null) {

            return res.status(404).json({
                mensaje: "No se encontró el participante."
            });
        }

        // Devuelve el participante al frontend
        res.status(200).json(participante);

    } catch (error) {

        console.error(
            "Error al consultar participante:",
            error
        );

        res.status(500).json({
            mensaje:
                "No se pudo consultar el participante."
        });
    }
}


// Función para modificar un participante
async function modificarParticipantePorId(req, res) {

    try {

        // Obtiene la conexión a la base de datos
        const baseDatos = req.app.locals.baseDatos;

        // Obtiene el identificador enviado en la dirección
        const idParticipante = req.params.id;

        // Construye únicamente los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(req.body);

        // Solicita al servicio modificar el participante
        const resultado =
            await modificarParticipante(
                baseDatos,
                idParticipante,
                datosActualizados
            );

        // Verifica si el identificador era válido
        if (resultado === null) {

            return res.status(400).json({
                mensaje:
                    "El identificador del participante no es válido."
            });
        }

        // Verifica si se encontró el participante
        if (resultado.matchedCount === 0) {

            return res.status(404).json({
                mensaje: "No se encontró el participante."
            });
        }

        // Responde cuando la modificación fue exitosa
        res.status(200).json({
            mensaje:
                "Participante modificado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al modificar participante:",
            error
        );

        res.status(500).json({
            mensaje:
                "No se pudo modificar el participante."
        });
    }
}

// Función para eliminar un participante
async function eliminarParticipantePorId(req, res) {

    try {

        // Obtiene la conexión a la base de datos
        const baseDatos = req.app.locals.baseDatos;

        // Obtiene el identificador enviado en la dirección
        const idParticipante = req.params.id;

        // Solicita al servicio eliminar el participante
        const resultado = await eliminarParticipante(
            baseDatos,
            idParticipante
        );

        // Verifica si se encontró y eliminó un participante
        if (resultado.deletedCount === 0) {

            return res.status(404).json({
                mensaje: "No se encontró el participante."
            });
        }

        // Responde al frontend cuando la eliminación fue exitosa
        res.status(200).json({
            mensaje: "Participante eliminado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al eliminar participante:",
            error
        );

        res.status(500).json({
            mensaje: "No se pudo eliminar el participante."
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