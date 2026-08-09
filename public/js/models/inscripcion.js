// Función para crear una inscripción en el frontend
export function crearInscripcion(
    participanteId,
    actividadId
){

    // Devuelve el objeto inscripción
    return{
        participanteId,
        actividadId,

        // Devuelve los datos que se enviarán al backend
        obtenerDatosParaGuardar: function(){

            return{
                participanteId: this.participanteId,
                actividadId: this.actividadId
            };
        }
    };
}