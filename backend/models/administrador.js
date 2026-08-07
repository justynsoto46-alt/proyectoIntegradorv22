// Aquí se define cómo luce el administrador.

// Función para crear el administrador con la estructura definida
function crearAdministrador(datos){

    return {
        nombreCompleto: datos.nombreCompleto,
        correo: datos.correo,
        contrasena: datos.contrasena,
        rol: datos.rol,
        fechaRegistro: new Date()
    };
}

// Función para crear los datos permitidos al modificar el administrador
function crearDatosActualizacion(datos){

    return {
        nombreCompleto: datos.nombreCompleto,
        correo: datos.correo,
        rol: datos.rol,
        fechaModificacion: new Date()
    };
}

// Exporta las funciones del modelo
module.exports = {
    crearAdministrador,
    crearDatosActualizacion
};
