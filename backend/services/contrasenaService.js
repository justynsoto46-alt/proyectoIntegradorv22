// Función para buscar un administrador por correo
async function buscarAdministradorPorCorreo(
    baseDatos,
    correo
){

    // Obtiene la colección de administradores
    const coleccionAdministradores =
        baseDatos.collection("administradores");

    // Busca un administrador con el correo indicado
    const administrador =
        await coleccionAdministradores.findOne({
            correo: correo
        });

    return administrador;
}


// Función para actualizar la contraseña
async function actualizarContrasena(
    baseDatos,
    correo,
    nuevaContrasena
){

    // Obtiene la colección de administradores
    const coleccionAdministradores =
        baseDatos.collection("administradores");

    // Actualiza la contraseña del administrador
    const resultado =
        await coleccionAdministradores.updateOne(
            {
                correo: correo
            },
            {
                $set: {
                    contrasena: nuevaContrasena
                }
            }
        );

    return resultado;
}


// Exporta las funciones
module.exports = {
    buscarAdministradorPorCorreo,
    actualizarContrasena
};