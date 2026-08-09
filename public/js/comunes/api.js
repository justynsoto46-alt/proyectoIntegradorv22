// Comunicación con el backend.
//
// api.js lo que hace es llamar a fetch, convertir la respuesta a JSON y revisar si viene un error. Devuelven los datos ya listos
// o lanzan un error con el mensaje que envió el servidor.


// Revisa la respuesta y devuelve su contenido en formato JSON
async function revisarRespuesta(respuesta){

    const datos = await respuesta.json();

    if(respuesta.ok === false){

        // El backend siempre responde con la propiedad "mensaje"
        throw new Error(
            datos.mensaje || "No fue posible completar la operación."
        );
    }

    return datos;
}


// Consulta una lista o un registro
export async function obtenerDatos(direccion){

    const respuesta = await fetch(direccion);

    return revisarRespuesta(respuesta);
}


// Envía un registro nuevo
export async function crearDatos(direccion, datos){

    const respuesta = await fetch(direccion, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    return revisarRespuesta(respuesta);
}


// Guarda los cambios de un registro existente
export async function actualizarDatos(direccion, datos){

    const respuesta = await fetch(direccion, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    return revisarRespuesta(respuesta);
}


// Elimina un registro
export async function eliminarDatos(direccion){

    const respuesta = await fetch(direccion, {
        method: "DELETE"
    });

    return revisarRespuesta(respuesta);
}
