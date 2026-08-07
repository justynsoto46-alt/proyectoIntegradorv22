// 1. Se obtienen los elementos del formulario
const formularioStand = document.getElementById("formularioStand");

const inputEvento = document.getElementById("evento");
const inputNombre = document.getElementById("Nombre");
const inputEncargado = document.getElementById("encargado");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");

const btnCancelar = document.getElementById("btnCancelar");


// Identificador del stand seleccionado en el listado
const idStand = sessionStorage.getItem("standModificarId");


// 2. Función para validar todos los campos vacíos
function validarCamposVacios() {
    let error = false;

    // Agrupamos los campos del Stand en un arreglo
    const camposObligatorios = [
        inputEvento,
        inputNombre,
        inputEncargado,
        inputCorreo,
        inputTelefono
    ];

    camposObligatorios.forEach(campo => {
        if (campo) {
            if (campo.value.trim() === "") {
                campo.classList.add("input-error");
                error = true;
            } else {
                campo.classList.remove("input-error");
            }
        }
    });

    return error;
}

// 3. Función para validar el teléfono
function validarTelefono() {
    let error = false;
    const telefono = inputTelefono.value.trim();

    // Verifica que el teléfono contenga solo números o que no tenga exactamente 8 dígitos
    if (isNaN(telefono) || telefono.length !== 8) {
        inputTelefono.classList.add("input-error");
        error = true;
    } else {
        inputTelefono.classList.remove("input-error");
    }

    return error;
}


// 4. Función para cargar los datos del stand desde el backend
async function cargarStandRetorno(){

    if(idStand === null){

        Swal.fire({
            title: "Stand no seleccionado",
            text: "Debe seleccionar un stand desde el listado.",
            icon: "warning",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href = "/pages/Stands/listarStands.html";
        });

        return;
    }

    try{

        const stand = await obtenerDatos(`/api/stands/${idStand}`);

        inputEvento.value = stand.evento || "";
        inputNombre.value = stand.nombre || "";
        inputEncargado.value = stand.encargado || "";
        inputCorreo.value = stand.correo || "";
        inputTelefono.value = stand.telefono || "";

    } catch(error){

        console.error("Error al cargar stand:", error);

        Swal.fire({
            title: "Error al cargar stand",
            text: "No fue posible obtener la información del stand.",
            icon: "error",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href = "/pages/Stands/listarStands.html";
        });
    }
}


// 5. Función Principal
async function modificarStandRetorno() {
    // Ejecutamos las validaciones
    const errorCamposVacios = validarCamposVacios();
    const errorTelefono = validarTelefono();

    // Verificamos que no haya errores
    if (errorCamposVacios === false && errorTelefono === false) {

        const datosActualizados = {
            evento: inputEvento.value.trim(),
            nombre: inputNombre.value.trim(),
            encargado: inputEncargado.value.trim(),
            correo: inputCorreo.value.trim(),
            telefono: inputTelefono.value.trim()
        };

        try{

            const datosRespuesta = await actualizarDatos(`/api/stands/${idStand}`, datosActualizados);

            Swal.fire({
                title: "Cambios guardados",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"

            }).then(function(){

                sessionStorage.removeItem("standModificarId");

                // Redirige a la lista de stands
                window.location.href = "/pages/Stands/listarStands.html";
            });

        } catch(error){

            console.error("Error al modificar stand:", error);

            Swal.fire({
                title: "No se pueden guardar los cambios",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }

    } else {
        Swal.fire({
            title: "No se pueden guardar los cambios",
            text: "Por favor revise los campos marcados en rojo.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}

// 6. Función para cancelar la modificación y volver al listado
function cancelarModificacionRetorno() {

    sessionStorage.removeItem("standModificarId");

    // Redirige a la lista de stands
    window.location.href = "/pages/Stands/listarStands.html";
}

// 7. Asignación de Eventos
if(formularioStand){
    formularioStand.addEventListener("submit", function(evento) {
        evento.preventDefault();
        modificarStandRetorno();
    });
}

if(btnCancelar){
    btnCancelar.addEventListener("click", cancelarModificacionRetorno);
}

// Carga los datos al abrir la pantalla
document.addEventListener("DOMContentLoaded", function(){

    cargarStandRetorno();
});
