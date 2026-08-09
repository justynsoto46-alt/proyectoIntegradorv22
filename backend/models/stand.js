// Aquí se define cómo luce el stand.

// Función para crear el stand con la estructura definida
function crearStand(datos){

    return {
        evento: datos.evento,
        nombre: datos.nombre,
        encargado: datos.encargado,
        correo: datos.correo,
        telefono: datos.telefono,
        descripcion: datos.descripcion,
        fechaRegistro: new Date()
    };
}

// Función para crear los datos permitidos al modificar el stand
function crearDatosActualizacion(datos){

    return {
        evento: datos.evento,
        nombre: datos.nombre,
        encargado: datos.encargado,
        correo: datos.correo,
        telefono: datos.telefono,
        descripcion: datos.descripcion,
        fechaModificacion: new Date()
    };
}

// Exporta las funciones del modelo
module.exports = {
    crearStand,
    crearDatosActualizacion
};
