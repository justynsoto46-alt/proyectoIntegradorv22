// Aquí se define cómo luce el evento.

// Función para crear el evento con la estructura definida
function crearEvento(datos){

    return {
        nombreEvento: datos.nombreEvento,
        descripcion: datos.descripcion,
        fechaInicio: datos.fechaInicio,
        fechaFin: datos.fechaFin,
        ubicacion: datos.ubicacion,
        estado: datos.estado,
        fechaRegistro: new Date()
    };
}

// Función para crear los datos permitidos al modificar el evento
function crearDatosActualizacion(datos){

    return {
        nombreEvento: datos.nombreEvento,
        descripcion: datos.descripcion,
        fechaInicio: datos.fechaInicio,
        fechaFin: datos.fechaFin,
        ubicacion: datos.ubicacion,
        estado: datos.estado,
        fechaModificacion: new Date()
    };
}

// Exporta las funciones del modelo
module.exports = {
    crearEvento,
    crearDatosActualizacion
};
