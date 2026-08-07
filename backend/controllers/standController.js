// Recibe las peticiones del navegador para stands.

// Importa las funciones del servicio de stands
const {
    insertarStand,
    obtenerStands,
    obtenerStandPorId,
    modificarStand,
    eliminarStand
} = require("../services/standService");

// Importa las funciones del modelo de stand
const {
    crearStand,
    crearDatosActualizacion
} = require("../models/stand");


// Función para registrar el stand
async function registrarStand(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos = req.app.locals.baseDatos;

        // Crea el stand utilizando la estructura del modelo
        const datosStand = crearStand(req.body);

        // Envía los datos al servicio para guardarlos en MongoDB
        const resultado = await insertarStand(
            baseDatos,
            datosStand
        );

        res.status(201).json({
            mensaje: "Stand registrado correctamente.",
            idStand: resultado.insertedId
        });

    } catch(error){

        console.error("Error al registrar stand:", error);

        res.status(500).json({
            mensaje: "No se pudo registrar el stand."
        });
    }
}

// Función para listar todos los stands
async function listarStands(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const stands = await obtenerStands(baseDatos);

        res.status(200).json(stands);

    } catch(error){

        console.error("Error al listar stands:", error);

        res.status(500).json({
            mensaje: "No se pudieron cargar los stands."
        });
    }
}

// Función para consultar el stand por su identificador
async function consultarStandPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idStand = req.params.id;

        const stand = await obtenerStandPorId(
            baseDatos,
            idStand
        );

        if(stand === null){

            return res.status(404).json({
                mensaje: "No se encontró el stand."
            });
        }

        res.status(200).json(stand);

    } catch(error){

        console.error("Error al consultar stand:", error);

        res.status(500).json({
            mensaje: "No se pudo consultar el stand."
        });
    }
}

// Función para modificar el stand
async function modificarStandPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idStand = req.params.id;

        // Construye únicamente los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(req.body);

        const resultado = await modificarStand(
            baseDatos,
            idStand,
            datosActualizados
        );

        // Verifica si el identificador era válido
        if(resultado === null){

            return res.status(400).json({
                mensaje:
                    "El identificador del stand no es válido."
            });
        }

        if(resultado.matchedCount === 0){

            return res.status(404).json({
                mensaje: "No se encontró el stand."
            });
        }

        res.status(200).json({
            mensaje: "Stand modificado correctamente."
        });

    } catch(error){

        console.error("Error al modificar stand:", error);

        res.status(500).json({
            mensaje: "No se pudo modificar el stand."
        });
    }
}

// Función para eliminar el stand
async function eliminarStandPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idStand = req.params.id;

        const resultado = await eliminarStand(
            baseDatos,
            idStand
        );

        // Verifica si el identificador era válido
        if(resultado === null){

            return res.status(400).json({
                mensaje:
                    "El identificador del stand no es válido."
            });
        }

        if(resultado.deletedCount === 0){

            return res.status(404).json({
                mensaje: "No se encontró el stand."
            });
        }

        res.status(200).json({
            mensaje: "Stand eliminado correctamente."
        });

    } catch(error){

        console.error("Error al eliminar stand:", error);

        res.status(500).json({
            mensaje: "No se pudo eliminar el stand."
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
