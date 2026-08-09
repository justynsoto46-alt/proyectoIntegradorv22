// Importa las funciones del servicio de responsables
import {
    obtenerResponsables,
    eliminarResponsable
} from "../services/responsableService.js";

// Importa funciones reutilizables
import {
    quitarTildes,
    darFormatoFecha
} from "../comunes/utilidades.js";

// Se obtienen los elementos necesarios para mostrar y buscar responsables

const inputBuscarResponsable = document.getElementById("buscarResponsable");
const cuerpoTablaResponsables = document.getElementById("cuerpoTablaResponsables");
const mensajeSinResultados = document.getElementById("sinResultados");
const textoPaginacion = document.getElementById("textoPaginacion");


// Arreglo que guarda temporalmente los responsables obtenidos desde MongoDB
let responsablesRegistrados = [];


// Función para mostrar todos los teléfonos de un responsable
function unirTelefonos(telefonos) {

    if (Array.isArray(telefonos)) {
        return telefonos.join(", ");
    }

    return telefonos || "";
}


// Función para crear las filas de la tabla
function mostrarResponsablesRetorno(responsables) {

    cuerpoTablaResponsables.innerHTML = "";

    if (responsables.length === 0) {

        mensajeSinResultados.style.display = "block";
        textoPaginacion.textContent = "Total de responsables: 0";
        return;
    }

    mensajeSinResultados.style.display = "none";

    responsables.forEach(function (responsable) {

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td class="celda-imagen">
                <i class="fa-regular fa-image"></i>
            </td>
            <td>${responsable.nombreCompleto || ""}</td>
            <td>${unirTelefonos(responsable.telefonos)}</td>
            <td>${responsable.institucion || ""}</td>
            <td>${responsable.area || ""}</td>
            <td>${darFormatoFecha(responsable.fechaRegistro)}</td>

            <td class="celda-acciones">
                <div class="acciones">

                    <button
                        type="button"
                        class="btn-icono boton-modificar"
                        data-id="${responsable._id}"
                        title="Modificar responsable">

                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        type="button"
                        class="btn-icono boton-eliminar"
                        data-id="${responsable._id}"
                        title="Eliminar responsable">

                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            </td>
        `;

        cuerpoTablaResponsables.appendChild(fila);
    });

    textoPaginacion.textContent =
        `Total de responsables: ${responsables.length}`;

    agregarEventosBotones();
}


// Función para consultar los responsables desde el backend
async function cargarResponsablesRetorno() {

    try {

        // Solicita los responsables por medio del service
        const responsables =
            await obtenerResponsables();

        responsablesRegistrados = responsables;

        buscarResponsableRetorno();

    } catch (error) {

        console.error("Error al cargar responsables:", error);

        mensajeSinResultados.textContent =
            "No fue posible cargar los responsables.";

        mensajeSinResultados.style.display = "block";

        Swal.fire({
            title: "Error al cargar responsables",
            text: "No fue posible obtener la información del servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para buscar responsables mientras se escribe
function buscarResponsableRetorno() {

    const textoBuscar =
        quitarTildes(inputBuscarResponsable.value.trim().toLowerCase());

    const responsablesFiltrados =
        responsablesRegistrados.filter(function (responsable) {

            const textoResponsable = quitarTildes(
                [
                    responsable.nombreCompleto,
                    unirTelefonos(responsable.telefonos),
                    responsable.institucion,
                    responsable.area,
                    responsable.correo
                ].join(" ").toLowerCase()
            );

            return textoResponsable.includes(textoBuscar);
        });

    mensajeSinResultados.textContent =
        "No se encontraron responsables que coincidan con la búsqueda.";

    mostrarResponsablesRetorno(responsablesFiltrados);
}


// Función para ir a modificar un responsable
function modificarResponsableRetorno(idResponsable) {

    sessionStorage.setItem("responsableModificarId", idResponsable);

    window.location.href = "/pages/Responsables/modificarResponsable.html";
}


// Función para confirmar la eliminación de un responsable
function eliminarResponsableRetorno(idResponsable) {

    Swal.fire({
        title: "¿Eliminar Responsable?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"

    }).then(async function (resultado) {

        if (resultado.isConfirmed) {

            try {

                // Solicita al service eliminar el responsable
                const datosRespuesta =
                    await eliminarResponsable(
                        idResponsable
                    );

                Swal.fire({
                    title: "Responsable eliminado",
                    text: datosRespuesta.mensaje,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                cargarResponsablesRetorno();

            } catch (error) {

                console.error("Error al eliminar responsable:", error);

                Swal.fire({
                    title: "Error",
                    text: "No fue posible eliminar el responsable.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        }
    });
}


// Función para agregar los eventos a los botones dinámicos
function agregarEventosBotones() {

    const botonesModificar =
        cuerpoTablaResponsables.querySelectorAll(".boton-modificar");

    const botonesEliminar =
        cuerpoTablaResponsables.querySelectorAll(".boton-eliminar");

    botonesModificar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            modificarResponsableRetorno(boton.getAttribute("data-id"));
        });
    });

    botonesEliminar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            eliminarResponsableRetorno(boton.getAttribute("data-id"));
        });
    });
}


// Ejecuta la búsqueda mientras el usuario escribe
inputBuscarResponsable.addEventListener("input", buscarResponsableRetorno);


// Carga los responsables al abrir la página
document.addEventListener("DOMContentLoaded", function () {

    cargarResponsablesRetorno();
});