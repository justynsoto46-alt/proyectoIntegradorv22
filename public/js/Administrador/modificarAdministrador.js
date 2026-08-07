// Se obtienen los elementos del formulario de modificación de administrador
const formularioAdministrador = document.getElementById("formularioAdministrador");

const inputNombreCompleto = document.getElementById("nombreCompleto");
const inputCorreo = document.getElementById("correo");
const inputRol = document.getElementById("rol");

const btnCancelar = document.getElementById("btnCancelar");


// Identificador del administrador seleccionado en el listado
const idAdministrador = sessionStorage.getItem("administradorModificarId");


// Función para validar los campos obligatorios
function validarCamposVacios(){

    let error = false;

    // Nombre completo
    if(inputNombreCompleto.value.trim() === ""){
        inputNombreCompleto.classList.add("input-error");
        error = true;
    } else{
        inputNombreCompleto.classList.remove("input-error");
    }

    if(inputCorreo.value.trim() === ""){
        inputCorreo.classList.add("input-error");
        error = true;
    } else{
        inputCorreo.classList.remove("input-error");
    }

    return error;
}


// Función para cargar los datos del administrador desde el backend
async function cargarAdministradorRetorno(){

    if(idAdministrador === null){

        Swal.fire({
            title: "Administrador no seleccionado",
            text: "Debe seleccionar un administrador desde el listado.",
            icon: "warning",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Administrador/listarAdmin.html";
        });

        return;
    }

    try{

        const administrador = await obtenerDatos(`/api/administradores/${idAdministrador}`);

        inputNombreCompleto.value = administrador.nombreCompleto || "";
        inputCorreo.value = administrador.correo || "";
        inputRol.value = administrador.rol || "";

    } catch(error){

        console.error("Error al cargar administrador:", error);

        Swal.fire({
            title: "Error al cargar administrador",
            text: "No fue posible obtener la información del administrador.",
            icon: "error",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Administrador/listarAdmin.html";
        });
    }
}


// Función Principal
async function modificarAdministradorRetorno(){

    if(validarCamposVacios() === false){

        const datosActualizados = {
            nombreCompleto: inputNombreCompleto.value.trim(),
            correo: inputCorreo.value.trim(),
            rol: inputRol.value
        };

        try{

            const datosRespuesta = await actualizarDatos(`/api/administradores/${idAdministrador}`, datosActualizados);

            Swal.fire({
                title: "Cambios guardados",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"

            }).then(function(){

                sessionStorage.removeItem("administradorModificarId");

                window.location.href =
                    "/pages/Administrador/listarAdmin.html";
            });

        } catch(error){

            console.error("Error al modificar administrador:", error);

            Swal.fire({
                title: "No se pueden guardar los cambios",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }

    } else{

        Swal.fire({
            title: "No se pueden guardar los cambios",
            text: "Por favor revise los campos marcados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}

// Función para cancelar la modificación y volver al listado
function cancelarModificacionRetorno(){

    sessionStorage.removeItem("administradorModificarId");

    window.location.href = "/pages/Administrador/listarAdmin.html";
}

// Evento que se ejecuta al enviar el formulario
formularioAdministrador.addEventListener("submit", function(evento){
    evento.preventDefault();
    modificarAdministradorRetorno();
});

// Evento que se ejecuta al presionar cancelar
btnCancelar.addEventListener("click", cancelarModificacionRetorno);

// Carga los datos al abrir la pantalla
document.addEventListener("DOMContentLoaded", function(){

    cargarAdministradorRetorno();
});
