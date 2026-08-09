// Función para crear un objeto administrador en el frontend
export function crearAdministrador(
    nombreCompleto,
    correo,
    contrasena,
    rol
){

    // Devuelve un objeto con la información del administrador
    return{
        nombreCompleto,
        correo,
        contrasena,
        rol,

        // Devuelve los datos necesarios para registrar
        obtenerDatosParaGuardar: function(){

            return{
                nombreCompleto: this.nombreCompleto,
                correo: this.correo,
                contrasena: this.contrasena,
                rol: this.rol
            };
        },

        // Devuelve los datos permitidos para modificar
        obtenerDatosParaModificar: function(){

            return{
                nombreCompleto: this.nombreCompleto,
                correo: this.correo,
                rol: this.rol
            };
        }
    };
}