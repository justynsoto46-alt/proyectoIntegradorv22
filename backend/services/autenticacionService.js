// Función para buscar un administrador por correo y contraseña
async function buscarAdministrador(
    baseDatos,
    correo,
    contrasena
){

    // Obtiene la colección de administradores
    const coleccionAdministradores =
        baseDatos.collection("administradores");

    // Busca un administrador que coincida con las credenciales
    const administrador =
        await coleccionAdministradores.findOne({
            correo: correo,
            contrasena: contrasena
        });

    return administrador;
}


// Exporta las funciones del servicio
module.exports = {
    buscarAdministrador
};