// Se obtienen los elementos necesarios para mostrar
// y buscar participantes
const inputBuscarParticipante =
    document.getElementById("buscarParticipante");

const cuerpoTablaParticipantes =
    document.getElementById("cuerpoTablaParticipantes");

const mensajeSinResultados =
    document.getElementById("sinResultados");

const textoPaginacion =
    document.getElementById("textoPaginacion");


// Arreglo que guarda temporalmente los participantes
// obtenidos desde MongoDB
let participantesRegistrados = [];


// Función para crear las filas de la tabla
function mostrarParticipantesRetorno(participantes){

    // Limpia el contenido anterior de la tabla
    cuerpoTablaParticipantes.innerHTML = "";

    // Verifica si existen participantes para mostrar
    if(participantes.length === 0){

        mensajeSinResultados.style.display = "block";

        textoPaginacion.textContent =
            "Total de participantes: 0";

        return;
    }

    // Oculta el mensaje cuando sí existen registros
    mensajeSinResultados.style.display = "none";

    // Recorre el arreglo de participantes
    participantes.forEach(function(participante){

        // Crea una fila nueva
        const fila = document.createElement("tr");

        // Agrega los datos y botones del participante
        fila.innerHTML = `
            <td>${participante.nombreCompleto}</td>
            <td>${participante.identificacion}</td>
            <td>${participante.correoElectronico}</td>
            <td>${participante.telefono}</td>

            <td class="celda-acciones">

                <button
                    type="button"
                    class="btn-icono boton-modificar"
                    data-id="${participante._id}"
                    title="Modificar participante">

                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    type="button"
                    class="btn-icono boton-eliminar"
                    data-id="${participante._id}"
                    title="Eliminar participante">

                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>
        `;

        // Agrega la fila al cuerpo de la tabla
        cuerpoTablaParticipantes.appendChild(fila);
    });

    // Actualiza la cantidad de participantes mostrados
    textoPaginacion.textContent =
        `Total de participantes: ${participantes.length}`;

    // Agrega los eventos a los botones recién creados
    agregarEventosBotones();
}


// Función para consultar participantes desde el backend
async function cargarParticipantesRetorno(){

    try{

        // Solicita los participantes a la API
        const participantes = await obtenerDatos("/api/participantes");

        // Guarda la lista obtenida desde MongoDB
        participantesRegistrados = participantes;

        // Muestra los participantes en la tabla
        mostrarParticipantesRetorno(
            participantesRegistrados
        );

    } catch(error){

        console.error(
            "Error al cargar participantes:",
            error
        );

        mensajeSinResultados.textContent =
            "No fue posible cargar los participantes.";

        mensajeSinResultados.style.display = "block";

        Swal.fire({
            title: "Error al cargar participantes",
            text: "No fue posible obtener la información del servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para buscar participantes
function buscarParticipanteRetorno(){

    const textoBuscar = quitarTildes(
        inputBuscarParticipante
            .value
            .trim()
            .toLowerCase()
    );

    // Si el campo está vacío, restaura la lista completa
    if(textoBuscar === ""){

        mensajeSinResultados.textContent =
            "No hay participantes registrados.";

        mostrarParticipantesRetorno(
            participantesRegistrados
        );

        return;
    }

    // Valida que tenga al menos 3 caracteres
    if(textoBuscar.length < 3){

        // No realiza todavía la búsqueda
        return;
    }

    // Filtra por nombre, identificación o correo
    const participantesFiltrados =
        participantesRegistrados.filter(
            function(participante){

                const nombre = quitarTildes(
                    participante.nombreCompleto
                        .toLowerCase()
                );

                const identificacion =
                    participante.identificacion
                        .toLowerCase();

                const correo = quitarTildes(
                    participante.correoElectronico
                        .toLowerCase()
                );

                return (
                    nombre.includes(textoBuscar) ||
                    identificacion.includes(textoBuscar) ||
                    correo.includes(textoBuscar)
                );
            }
        );

    // Cambia el mensaje para búsquedas sin coincidencias
    mensajeSinResultados.textContent =
        "No se encontraron participantes que coincidan con la búsqueda.";

    // Muestra únicamente los resultados filtrados
    mostrarParticipantesRetorno(
        participantesFiltrados
    );
}


// Función para ir a modificar un participante
function modificarParticipanteRetorno(idParticipante){

    // Guarda temporalmente el id seleccionado
    sessionStorage.setItem(
        "participanteModificarId",
        idParticipante
    );

    // Redirige a la pantalla de modificación
    window.location.href =
        "/pages/Participantes/modificarParticipante.html";
}


// Función para eliminar un participante
async function eliminarParticipanteRetorno(idParticipante){

    Swal.fire({
        title: "¿Eliminar participante?",
        text: "El participante podría tener inscripciones activas. Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"

    }).then(async function(resultado){

        // Verifica si el usuario confirmó la eliminación
        if(resultado.isConfirmed){

            try{

                // Envía la solicitud al backend para eliminar
                const datosRespuesta = await eliminarDatos(
                    `/api/participantes/${idParticipante}`
                );

                // Muestra el mensaje de éxito
                Swal.fire({
                    title: "Participante eliminado",
                    text: datosRespuesta.mensaje,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                // Vuelve a consultar la base de datos
                cargarParticipantesRetorno();

            } catch(error){

                console.error(
                    "Error al eliminar participante:",
                    error
                );

                Swal.fire({
                    title: "Error",
                    text: "No fue posible eliminar el participante.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });

            }

        }

    });

}


// Función para agregar eventos a los botones dinámicos
function agregarEventosBotones(){

    const botonesModificar =
        document.querySelectorAll(
            ".boton-modificar"
        );

    const botonesEliminar =
        document.querySelectorAll(
            ".boton-eliminar"
        );

    // Agrega el evento a los botones Modificar
    botonesModificar.forEach(function(boton){

        boton.addEventListener(
            "click",
            function(){

                modificarParticipanteRetorno(
                    boton.getAttribute("data-id")
                );
            }
        );
    });

    // Agrega el evento a los botones Eliminar
    botonesEliminar.forEach(function(boton){

        boton.addEventListener(
            "click",
            function(){

                eliminarParticipanteRetorno(
                    boton.getAttribute("data-id")
                );
            }
        );
    });
}


// Ejecuta la búsqueda mientras el usuario escribe
inputBuscarParticipante.addEventListener(
    "input",
    function(){

        buscarParticipanteRetorno();
    }
);


// Carga los participantes al abrir la página
document.addEventListener(
    "DOMContentLoaded",
    function(){

        cargarParticipantesRetorno();
    }
);