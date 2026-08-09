// Función para crear un objeto participante en el frontend
export function crearParticipante(
    nombreCompleto,
    identificacion,
    correoElectronico,
    telefono,
    edad,
    profesion,
    id = ""
){

    // Devuelve un objeto con la información del participante
    return{

        nombreCompleto,
        identificacion,
        correoElectronico,
        telefono,

        // Convierte la edad a número si fue ingresada
        edad: edad === "" ? null : Number(edad),

        profesion,

        // Guarda el identificador si el participante ya existe
        id,

        // Devuelve los datos necesarios para registrar
        obtenerDatosParaGuardar: function(){

            return{
                nombreCompleto: this.nombreCompleto,
                identificacion: this.identificacion,
                correoElectronico: this.correoElectronico,
                telefono: this.telefono,
                edad: this.edad,
                profesion: this.profesion
            };
        },

        // Devuelve únicamente los datos permitidos para modificar
        obtenerDatosParaModificar: function(){

            return{
                nombreCompleto: this.nombreCompleto,
                telefono: this.telefono,
                edad: this.edad,
                profesion: this.profesion
            };
        }
    };
}