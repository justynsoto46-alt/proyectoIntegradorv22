// Se obtienen los elementos necesarios para mostrar, buscar,
// modificar y eliminar administradores

const inputBuscarAdmin = document.getElementById("buscarAdmin");
const selectRol = document.getElementById("filtroEstado");
const cuerpoTablaAdministradores =
    document.getElementById("cuerpoTablaAdministradores");
const mensajeSinResultados = document.getElementById("sinResultados");


// Arreglo que guarda temporalmente los administradores obtenidos desde MongoDB
let administradoresRegistrados = [];


// Función para crear las filas de la tabla
function mostrarAdministradoresRetorno(administradores){

    cuerpoTablaAdministradores.innerHTML = "";

    if(administradores.length === 0){

        mensajeSinResultados.style.display = "block";
        return;
    }

    mensajeSinResultados.style.display = "none";

    administradores.forEach(function(administrador){

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td class="celda-imagen">
                <i class="fa-regular fa-image"></i>
            </td>
            <td>${administrador.nombreCompleto || ""}</td>
            <td>${administrador.correo || ""}</td>
            <td>${administrador.rol || ""}</td>

            <td class="celda-acciones">

                <button
                    type="button"
                    class="btn-icono boton-modificar"
                    data-id="${administrador._id}"
                    title="Modificar administrador">

                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    type="button"
                    class="btn-icono boton-eliminar"
                    data-id="${administrador._id}"
                    title="Eliminar administrador">

                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>
        `;

        cuerpoTablaAdministradores.appendChild(fila);
    });

    agregarEventosBotones();
}


// Función para consultar los administradores desde el backend
async function cargarAdministradoresRetorno(){

    try{

        const administradores = await obtenerDatos("/api/administradores");

        administradoresRegistrados = administradores;

        aplicarFiltros();

    } catch(error){

        console.error("Error al cargar administradores:", error);

        mensajeSinResultados.textContent =
            "No fue posible cargar los administradores.";

        mensajeSinResultados.style.display = "block";

        Swal.fire({
            title: "Error al cargar administradores",
            text: "No fue posible obtener la información del servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}


// Función para filtrar por texto y por rol
function aplicarFiltros(){

    const textoBuscar =
        quitarTildes(inputBuscarAdmin.value.trim().toLowerCase());

    const rol = selectRol.value;

    const administradoresFiltrados =
        administradoresRegistrados.filter(function(administrador){

            const textoAdministrador = quitarTildes(
                [
                    administrador.nombreCompleto,
                    administrador.correo,
                    administrador.rol
                ].join(" ").toLowerCase()
            );

            const cumpleTexto = textoAdministrador.includes(textoBuscar);

            const cumpleRol =
                rol === "" || administrador.rol === rol;

            return cumpleTexto && cumpleRol;
        });

    mensajeSinResultados.textContent =
        "No se encontraron administradores que coincidan con la búsqueda.";

    mostrarAdministradoresRetorno(administradoresFiltrados);
}


// Función para ir a modificar un administrador
function modificarAdminRetorno(idAdministrador){

    sessionStorage.setItem("administradorModificarId", idAdministrador);

    window.location.href =
        "/pages/Administrador/modificarAdministrador.html";
}


// Función para confirmar la eliminación de un administrador
function eliminarAdminRetorno(idAdministrador){

    Swal.fire({
        title: "¿Eliminar Administrador?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"

    }).then(async function(resultado){

        if(resultado.isConfirmed){

            try{

                const datosRespuesta = await eliminarDatos(`/api/administradores/${idAdministrador}`);

                Swal.fire({
                    title: "Administrador eliminado",
                    text: datosRespuesta.mensaje,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                cargarAdministradoresRetorno();

            } catch(error){

                console.error("Error al eliminar administrador:", error);

                Swal.fire({
                    title: "Error",
                    text: "No fue posible eliminar el administrador.",
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
        cuerpoTablaAdministradores.querySelectorAll(".boton-modificar");

    const botonesEliminar =
        cuerpoTablaAdministradores.querySelectorAll(".boton-eliminar");

    botonesModificar.forEach(function(boton){

        boton.addEventListener("click", function(){

            modificarAdminRetorno(boton.getAttribute("data-id"));
        });
    });

    botonesEliminar.forEach(function(boton){

        boton.addEventListener("click", function(){

            eliminarAdminRetorno(boton.getAttribute("data-id"));
        });
    });
}


// Ejecuta la búsqueda mientras el usuario escribe
inputBuscarAdmin.addEventListener("input", aplicarFiltros);

// Ejecuta el filtro al cambiar el rol
selectRol.addEventListener("change", aplicarFiltros);


// Carga los administradores al abrir la página
document.addEventListener("DOMContentLoaded", function(){

    cargarAdministradoresRetorno();
});
