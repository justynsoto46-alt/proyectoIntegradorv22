// Aquí definiremos cómo luce un participante.

// Función para crear un participante con la estructura definida
function crearParticipante(datos){

    return {
        nombreCompleto: datos.nombreCompleto,
        identificacion: datos.identificacion,
        correoElectronico: datos.correoElectronico,
        telefono: datos.telefono,
        edad: datos.edad,
        profesion: datos.profesion,
        fechaRegistro: new Date()
    };
}

// Función para crear los datos permitidos al modificar un participante
function crearDatosActualizacion(datos){

    return {
        nombreCompleto: datos.nombreCompleto,
        telefono: datos.telefono,
        edad: datos.edad,
        profesion: datos.profesion,
        fechaModificacion: new Date()
    };
}

// Exporta la función del modelo
module.exports = {
    crearParticipante,
    crearDatosActualizacion
};