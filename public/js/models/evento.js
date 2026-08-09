// Función para crear un objeto evento en el frontend
export function crearEvento(
    nombreEvento,
    descripcion,
    fechaInicio,
    fechaFin,
    ubicacion,
    estado
){

    // Devuelve un objeto con la información del evento
    return{
        nombreEvento,
        descripcion,
        fechaInicio,
        fechaFin,
        ubicacion,
        estado,

        // Devuelve los datos necesarios para registrar
        obtenerDatosParaGuardar: function(){

            return{
                nombreEvento: this.nombreEvento,
                descripcion: this.descripcion,
                fechaInicio: this.fechaInicio,
                fechaFin: this.fechaFin,
                ubicacion: this.ubicacion,
                estado: this.estado
            };
        },

        // Devuelve los datos permitidos para modificar
        obtenerDatosParaModificar: function(){

            return{
                nombreEvento: this.nombreEvento,
                descripcion: this.descripcion,
                fechaInicio: this.fechaInicio,
                fechaFin: this.fechaFin,
                ubicacion: this.ubicacion,
                estado: this.estado
            };
        }
    };
}