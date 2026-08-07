// Recibe las peticiones del navegador para responsables.

// Importa las funciones del servicio de responsables
const {
    insertarResponsable,
    obtenerResponsables,
    obtenerResponsablePorId,
    obtenerResponsablePorCorreo,
    modificarResponsable,
    eliminarResponsable
} = require("../services/responsableService");

// Importa las funciones del modelo de responsable
const {
    crearResponsable,
    crearDatosActualizacion
} = require("../models/responsable");


// Función para registrar el responsable
async function registrarResponsable(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos = req.app.locals.baseDatos;

        // Crea el responsable utilizando la estructura del modelo
        const datosResponsable = crearResponsable(req.body);

        // Verifica que no exista otro registro con el mismo correo
        const responsableExistente =
            await obtenerResponsablePorCorreo(
                baseDatos,
                datosResponsable.correo
            );

        if(responsableExistente !== null){

            return res.status(409).json({
                mensaje:
                    "Ya existe un responsable registrado con este correo."
            });
        }

        // Envía los datos al servicio para guardarlos en MongoDB
        const resultado = await insertarResponsable(
            baseDatos,
            datosResponsable
        );

        res.status(201).json({
            mensaje: "Responsable registrado correctamente.",
            idResponsable: resultado.insertedId
        });

    } catch(error){

        console.error("Error al registrar responsable:", error);

        res.status(500).json({
            mensaje: "No se pudo registrar el responsable."
        });
    }
}

// Función para listar todos los responsables
async function listarResponsables(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const responsables = await obtenerResponsables(baseDatos);

        res.status(200).json(responsables);

    } catch(error){

        console.error("Error al listar responsables:", error);

        res.status(500).json({
            mensaje: "No se pudieron cargar los responsables."
        });
    }
}

// Función para consultar el responsable por su identificador
async function consultarResponsablePorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idResponsable = req.params.id;

        const responsable = await obtenerResponsablePorId(
            baseDatos,
            idResponsable
        );

        if(responsable === null){

            return res.status(404).json({
                mensaje: "No se encontró el responsable."
            });
        }

        res.status(200).json(responsable);

    } catch(error){

        console.error("Error al consultar responsable:", error);

        res.status(500).json({
            mensaje: "No se pudo consultar el responsable."
        });
    }
}

// Función para modificar el responsable
async function modificarResponsablePorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idResponsable = req.params.id;

        // Construye únicamente los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(req.body);

        const resultado = await modificarResponsable(
            baseDatos,
            idResponsable,
            datosActualizados
        );

        // Verifica si el identificador era válido
        if(resultado === null){

            return res.status(400).json({
                mensaje:
                    "El identificador del responsable no es válido."
            });
        }

        if(resultado.matchedCount === 0){

            return res.status(404).json({
                mensaje: "No se encontró el responsable."
            });
        }

        res.status(200).json({
            mensaje: "Responsable modificado correctamente."
        });

    } catch(error){

        console.error("Error al modificar responsable:", error);

        res.status(500).json({
            mensaje: "No se pudo modificar el responsable."
        });
    }
}

// Función para eliminar el responsable
async function eliminarResponsablePorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idResponsable = req.params.id;

        const resultado = await eliminarResponsable(
            baseDatos,
            idResponsable
        );

        // Verifica si el identificador era válido
        if(resultado === null){

            return res.status(400).json({
                mensaje:
                    "El identificador del responsable no es válido."
            });
        }

        if(resultado.deletedCount === 0){

            return res.status(404).json({
                mensaje: "No se encontró el responsable."
            });
        }

        res.status(200).json({
            mensaje: "Responsable eliminado correctamente."
        });

    } catch(error){

        console.error("Error al eliminar responsable:", error);

        res.status(500).json({
            mensaje: "No se pudo eliminar el responsable."
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
