// Recibe las peticiones del navegador para administradores.

// Importa las funciones del servicio de administradores
const {
    insertarAdministrador,
    obtenerAdministradores,
    obtenerAdministradorPorId,
    obtenerAdministradorPorCorreo,
    modificarAdministrador,
    eliminarAdministrador
} = require("../services/administradorService");

// Importa las funciones del modelo de administrador
const {
    crearAdministrador,
    crearDatosActualizacion
} = require("../models/administrador");


// Función para registrar el administrador
async function registrarAdministrador(req, res){

    try{

        // Obtiene la base de datos guardada en Express
        const baseDatos = req.app.locals.baseDatos;

        // Crea el administrador utilizando la estructura del modelo
        const datosAdministrador = crearAdministrador(req.body);

        // Verifica que no exista otro registro con el mismo correo
        const administradorExistente =
            await obtenerAdministradorPorCorreo(
                baseDatos,
                datosAdministrador.correo
            );

        if(administradorExistente !== null){

            return res.status(409).json({
                mensaje:
                    "Ya existe un administrador registrado con este correo."
            });
        }

        // Envía los datos al servicio para guardarlos en MongoDB
        const resultado = await insertarAdministrador(
            baseDatos,
            datosAdministrador
        );

        res.status(201).json({
            mensaje: "Administrador registrado correctamente.",
            idAdministrador: resultado.insertedId
        });

    } catch(error){

        console.error("Error al registrar administrador:", error);

        res.status(500).json({
            mensaje: "No se pudo registrar el administrador."
        });
    }
}

// Función para listar todos los administradores
async function listarAdministradores(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const administradores = await obtenerAdministradores(baseDatos);

        res.status(200).json(administradores);

    } catch(error){

        console.error("Error al listar administradores:", error);

        res.status(500).json({
            mensaje: "No se pudieron cargar los administradores."
        });
    }
}

// Función para consultar el administrador por su identificador
async function consultarAdministradorPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idAdministrador = req.params.id;

        const administrador = await obtenerAdministradorPorId(
            baseDatos,
            idAdministrador
        );

        if(administrador === null){

            return res.status(404).json({
                mensaje: "No se encontró el administrador."
            });
        }

        res.status(200).json(administrador);

    } catch(error){

        console.error("Error al consultar administrador:", error);

        res.status(500).json({
            mensaje: "No se pudo consultar el administrador."
        });
    }
}

// Función para modificar el administrador
async function modificarAdministradorPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idAdministrador = req.params.id;

        // Construye únicamente los campos permitidos
        const datosActualizados =
            crearDatosActualizacion(req.body);

        const resultado = await modificarAdministrador(
            baseDatos,
            idAdministrador,
            datosActualizados
        );

        // Verifica si el identificador era válido
        if(resultado === null){

            return res.status(400).json({
                mensaje:
                    "El identificador del administrador no es válido."
            });
        }

        if(resultado.matchedCount === 0){

            return res.status(404).json({
                mensaje: "No se encontró el administrador."
            });
        }

        res.status(200).json({
            mensaje: "Administrador modificado correctamente."
        });

    } catch(error){

        console.error("Error al modificar administrador:", error);

        res.status(500).json({
            mensaje: "No se pudo modificar el administrador."
        });
    }
}

// Función para eliminar el administrador
async function eliminarAdministradorPorId(req, res){

    try{

        const baseDatos = req.app.locals.baseDatos;

        const idAdministrador = req.params.id;

        const resultado = await eliminarAdministrador(
            baseDatos,
            idAdministrador
        );

        // Verifica si el identificador era válido
        if(resultado === null){

            return res.status(400).json({
                mensaje:
                    "El identificador del administrador no es válido."
            });
        }

        if(resultado.deletedCount === 0){

            return res.status(404).json({
                mensaje: "No se encontró el administrador."
            });
        }

        res.status(200).json({
            mensaje: "Administrador eliminado correctamente."
        });

    } catch(error){

        console.error("Error al eliminar administrador:", error);

        res.status(500).json({
            mensaje: "No se pudo eliminar el administrador."
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
