// Se obtienen los elementos necesarios para mostrar y buscar stands

const inputBuscarStand = document.getElementById("buscarStand");
const cuerpoTablaStands = document.getElementById("cuerpoTablaStands");
const mensajeSinResultados = document.getElementById("sinResultados");
const textoPaginacion = document.getElementById("textoPaginacion");


// Arreglo que guarda temporalmente los stands obtenidos desde MongoDB
let standsRegistrados = [];


// Función para crear las filas de la tabla
function mostrarStandsRetorno(stands){

    cuerpoTablaStands.innerHTML = "";

    if(stands.length === 0){

        mensajeSinResultados.style.display = "block";
        textoPaginacion.textContent = "Total de stands: 0";
        return;
    }

    mensajeSinResultados.style.display = "none";

    stands.forEach(function(stand){

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${stand.evento || ""}</td>
            <td>${stand.nombre || ""}</td>
            <td>${stand.encargado || ""}</td>
            <td>${stand.correo || ""}</td>
            <td>${stand.telefono || ""}</td>

            <td class="celda-acciones">

                <button
                    type="button"
                    class="btn-icono boton-modificar"
                    data-id="${stand._id}"
                    title="Modificar stand">

                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    type="button"
                    class="btn-icono boton-eliminar"
                    data-id="${stand._id}"
                    title="Eliminar stand">

                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>
        `;

        cuerpoTablaStands.appendChild(fila);
    });

    textoPaginacion.textContent =
        `Total de stands: ${stands.length}`;

    agregarEventosBotones();
}


// Función para consultar los stands desde el backend
async function cargarStandsRetorno(){

    try{

        const stands = await obtenerDatos("/api/stands");

        standsRegistrados = stands;

        buscarStandRetorno();

    } catch(error){

        console.error("Error al cargar stands:", error);

        mensajeSinResultados.textContent =
            "No fue posible cargar los stands.";

        mensajeSinResultados.style.display = "block";

        Swal.fire({
            title: "Error al cargar stands",
            text: "No fue posible obtener la información del servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para buscar stands mientras se escribe
function buscarStandRetorno(){

    const textoBuscar =
        quitarTildes(inputBuscarStand.value.trim().toLowerCase());

    const standsFiltrados = standsRegistrados.filter(function(stand){

        const textoStand = quitarTildes(
            [
                stand.evento,
                stand.nombre,
                stand.encargado,
                stand.correo,
                stand.telefono
            ].join(" ").toLowerCase()
        );

        return textoStand.includes(textoBuscar);
    });

    mensajeSinResultados.textContent =
        "No se encontraron stands que coincidan con la búsqueda.";

    mostrarStandsRetorno(standsFiltrados);
}


// Función para ir a modificar un stand
function modificarStandRetorno(idStand){

    sessionStorage.setItem("standModificarId", idStand);

    window.location.href = "/pages/Stands/modificarStands.html";
}


// Función para confirmar la eliminación de un stand
function eliminarStandRetorno(idStand){

    Swal.fire({
        title: "¿Eliminar Stand?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"

    }).then(async function(resultado){

        if(resultado.isConfirmed){

            try{

                const datosRespuesta = await eliminarDatos(`/api/stands/${idStand}`);

                Swal.fire({
                    title: "Stand eliminado",
                    text: datosRespuesta.mensaje,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                cargarStandsRetorno();

            } catch(error){

                console.error("Error al eliminar stand:", error);

                Swal.fire({
                    title: "Error",
                    text: "No fue posible eliminar el stand.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        }
    });
}


// Función para agregar los eventos a los botones dinámicos
function agregarEventosBotones(){

    const botonesModificar =
        cuerpoTablaStands.querySelectorAll(".boton-modificar");

    const botonesEliminar =
        cuerpoTablaStands.querySelectorAll(".boton-eliminar");

    botonesModificar.forEach(function(boton){

        boton.addEventListener("click", function(){

            modificarStandRetorno(boton.getAttribute("data-id"));
        });
    });

    botonesEliminar.forEach(function(boton){

        boton.addEventListener("click", function(){

            eliminarStandRetorno(boton.getAttribute("data-id"));
        });
    });
}


// Búsqueda en vivo mientras el usuario escribe
inputBuscarStand.addEventListener("input", buscarStandRetorno);


// Carga los stands al abrir la página
document.addEventListener("DOMContentLoaded", function(){

    cargarStandsRetorno();
});
