// Importa las funciones del servicio de contraseña
const {
    buscarAdministradorPorCorreo,
    actualizarContrasena
} = require("../services/contrasenaService");


// Función para modificar la contraseña
async function modificarContrasena(req, res){

    try{

        // Obtiene la conexión a MongoDB
        const baseDatos =
            req.app.locals.baseDatos;

        // Obtiene los datos enviados desde el frontend
        const {
            correo,
            nuevaContrasena
        } = req.body;


        // Verifica que se hayan enviado ambos datos
        if(!correo || !nuevaContrasena){

            return res.status(400).json({
                mensaje:
                    "Debe ingresar el correo y la nueva contraseña."
            });
        }


        // Busca el administrador por correo
        const administrador =
            await buscarAdministradorPorCorreo(
                baseDatos,
                correo
            );


        // Verifica que el administrador exista
        if(administrador === null){

            return res.status(404).json({
                mensaje:
                    "No existe un administrador registrado con este correo."
            });
        }


        // Actualiza la contraseña
        const resultado =
            await actualizarContrasena(
                baseDatos,
                correo,
                nuevaContrasena
            );


        // Verifica si se realizó la modificación
        if(resultado.matchedCount === 0){

            return res.status(404).json({
                mensaje:
                    "No se pudo encontrar el administrador."
            });
        }


        // Respuesta exitosa
        res.status(200).json({
            mensaje:
                "La contraseña fue modificada correctamente."
        });

    } catch(error){

        console.error(
            "Error al modificar contraseña:",
            error
        );

        res.status(500).json({
            mensaje:
                "No fue posible modificar la contraseña."
        });
    }
}


// Exporta el controlador
module.exports = {
    modificarContrasena
};