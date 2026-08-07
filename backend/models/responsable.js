// Aquí se define cómo luce el responsable.

// Función para crear el responsable con la estructura definida
function crearResponsable(datos){

    return {
        nombreCompleto: datos.nombreCompleto,
        correo: datos.correo,
        institucion: datos.institucion,
        telefonos: datos.telefonos,
        area: datos.area,
        biografia: datos.biografia,
        fechaRegistro: new Date()
    };
}

// Función para crear los datos permitidos al modificar el responsable
function crearDatosActualizacion(datos){

    return {
        nombreCompleto: datos.nombreCompleto,
        telefonos: datos.telefonos,
        institucion: datos.institucion,
        area: datos.area,
        biografia: datos.biografia,
        fechaModificacion: new Date()
    };
}

// Exporta las funciones del modelo
module.exports = {
    crearResponsable,
    crearDatosActualizacion
};
