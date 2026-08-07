// Mensajes en pantalla.
//
// Las mismas cuatro llamadas a Swal.fire aparecían escritas una y otra
// vez en cada archivo. Aquí quedan con un nombre claro y una sola forma.


// Aviso de operación correcta
function avisarExito(titulo, texto){

    return Swal.fire({
        title: titulo,
        text: texto,
        icon: "success",
        confirmButtonText: "Aceptar"
    });
}


// Aviso de error
function avisarError(titulo, texto){

    return Swal.fire({
        title: titulo,
        text: texto,
        icon: "error",
        confirmButtonText: "Aceptar"
    });
}


// Aviso de datos incompletos o inválidos
function avisarAdvertencia(titulo, texto){

    return Swal.fire({
        title: titulo,
        text: texto,
        icon: "warning",
        confirmButtonText: "Aceptar"
    });
}


// Pregunta antes de una acción que no se puede deshacer.
// Devuelve true solo si la persona confirma.
async function confirmarAccion(titulo, texto, textoConfirmar){

    const resultado = await Swal.fire({
        title: titulo,
        text: texto,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: textoConfirmar || "Sí, continuar",
        cancelButtonText: "Cancelar"
    });

    return resultado.isConfirmed;
}


// Mensaje que aparece cuando no se puede hablar con el servidor
function avisarErrorConexion(){

    return avisarError(
        "Error de conexión",
        "No fue posible comunicarse con el servidor."
    );
}
