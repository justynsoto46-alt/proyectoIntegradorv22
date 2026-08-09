// Función para crear un objeto responsable en el frontend
export function crearResponsable(
    nombreCompleto,
    correo,
    institucion,
    telefonos,
    area,
    biografia
){

    // Devuelve un objeto con la información del responsable
    return{

        nombreCompleto,
        correo,
        institucion,
        telefonos,
        area,
        biografia,

        // Devuelve los datos necesarios para registrar
        obtenerDatosParaGuardar: function(){

            return{
                nombreCompleto: this.nombreCompleto,
                correo: this.correo,
                institucion: this.institucion,
                telefonos: this.telefonos,
                area: this.area,
                biografia: this.biografia
            };
        },

        // Devuelve los datos permitidos para modificar
        obtenerDatosParaModificar: function(){

            return{
                nombreCompleto: this.nombreCompleto,
                institucion: this.institucion,
                telefonos: this.telefonos,
                area: this.area,
                biografia: this.biografia
            };
        }
    };
}