// Importa las funciones del servicio de autenticación
const {
    buscarAdministrador
} = require("../services/autenticacionService");


// Función para iniciar sesión
async function iniciarSesion(req, res){

    try{

        // Obtiene la conexión a MongoDB
        const baseDatos =
            req.app.locals.baseDatos;

        // Obtiene las credenciales enviadas desde el frontend
        const {
            correo,
            contrasena
        } = req.body;


        // Verifica que se hayan enviado ambos campos
        if(!correo || !contrasena){

            return res.status(400).json({
                mensaje:
                    "Debe ingresar el correo y la contraseña."
            });
        }


        // Busca el administrador en MongoDB
        const administrador =
            await buscarAdministrador(
                baseDatos,
                correo,
                contrasena
            );


        // Verifica si las credenciales son correctas
        if(administrador === null){

            return res.status(401).json({
                mensaje:
                    "El correo o la contraseña no son válidos."
            });
        }


        // Devuelve la información necesaria al frontend
        res.status(200).json({
            mensaje:
                "Inicio de sesión exitoso.",

            administrador: {
                _id: administrador._id,
                nombreCompleto:
                    administrador.nombreCompleto,
                correo:
                    administrador.correo,
                rol:
                    administrador.rol
            }
        });

    } catch(error){

        console.error(
            "Error al iniciar sesión:",
            error
        );

        res.status(500).json({
            mensaje:
                "No se pudo iniciar sesión."
        });
    }
}


// Exporta las funciones del controlador
module.exports = {
    iniciarSesion
};