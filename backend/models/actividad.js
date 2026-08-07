// Aquí se define cómo luce la actividad.

// Función para crear la actividad con la estructura definida
function crearActividad(datos){

    return {
        nombreActividad: datos.nombreActividad,
        eventoAsociado: datos.eventoAsociado,
        categoria: datos.categoria,
        descripcion: datos.descripcion,
        fecha: datos.fecha,
        horaInicio: datos.horaInicio,
        horaFin: datos.horaFin,
        ubicacion: datos.ubicacion,
        cupo: datos.cupo,
        responsable: datos.responsable,
        estado: datos.estado,
        fechaRegistro: new Date()
    };
}

// Función para crear los datos permitidos al modificar la actividad
function crearDatosActualizacion(datos){

    return {
        nombreActividad: datos.nombreActividad,
        categoria: datos.categoria,
        descripcion: datos.descripcion,
        fecha: datos.fecha,
        horaInicio: datos.horaInicio,
        horaFin: datos.horaFin,
        ubicacion: datos.ubicacion,
        cupo: datos.cupo,
        responsable: datos.responsable,
        estado: datos.estado,
        fechaModificacion: new Date()
    };
}

// Exporta las funciones del modelo
module.exports = {
    crearActividad,
    crearDatosActualizacion
};
