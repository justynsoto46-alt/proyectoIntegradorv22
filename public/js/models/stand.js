// Función para crear un objeto stand en el frontend
export function crearStand(
    evento,
    nombre,
    encargado,
    correo,
    telefono,
    descripcion
){

    // Devuelve un objeto con la información del stand
    return{
        evento,
        nombre,
        encargado,
        correo,
        telefono,
        descripcion,

        // Devuelve los datos necesarios para registrar
        obtenerDatosParaGuardar: function(){

            return{
                evento: this.evento,
                nombre: this.nombre,
                encargado: this.encargado,
                correo: this.correo,
                telefono: this.telefono,
                descripcion: this.descripcion
            };
        },

        // Devuelve los datos permitidos para modificar
        obtenerDatosParaModificar: function(){

            return{
                evento: this.evento,
                nombre: this.nombre,
                encargado: this.encargado,
                correo: this.correo,
                telefono: this.telefono,
                descripcion: this.descripcion
            };
        }
    };
}