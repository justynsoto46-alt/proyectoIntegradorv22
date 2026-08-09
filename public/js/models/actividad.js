// Función para crear un objeto actividad en el frontend
export function crearActividad(
    nombreActividad,
    eventoAsociado,
    categoria,
    descripcion,
    fecha,
    horaInicio,
    horaFin,
    ubicacion,
    cupo,
    responsable,
    estado
){

    return{
        nombreActividad,
        eventoAsociado,
        categoria,
        descripcion,
        fecha,
        horaInicio,
        horaFin,
        ubicacion,
        cupo: Number(cupo),
        responsable,
        estado,

        // Devuelve los datos necesarios para registrar
        obtenerDatosParaGuardar: function(){

            return{
                nombreActividad: this.nombreActividad,
                eventoAsociado: this.eventoAsociado,
                categoria: this.categoria,
                descripcion: this.descripcion,
                fecha: this.fecha,
                horaInicio: this.horaInicio,
                horaFin: this.horaFin,
                ubicacion: this.ubicacion,
                cupo: this.cupo,
                responsable: this.responsable,
                estado: this.estado
            };
        },

        // Devuelve los datos permitidos para modificar
        obtenerDatosParaModificar: function(){

            return{
                nombreActividad: this.nombreActividad,
                eventoAsociado: this.eventoAsociado,
                categoria: this.categoria,
                descripcion: this.descripcion,
                fecha: this.fecha,
                horaInicio: this.horaInicio,
                horaFin: this.horaFin,
                ubicacion: this.ubicacion,
                cupo: this.cupo,
                responsable: this.responsable,
                estado: this.estado
            };
        }
    };
}