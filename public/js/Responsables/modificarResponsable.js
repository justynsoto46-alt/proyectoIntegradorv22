// 1. Se obtienen los elementos del formulario
const formularioResponsable = document.getElementById("formularioResponsable");

const inputNombreCompleto = document.getElementById("nombreCompleto");
const inputTelefono = document.getElementById("telefono");
const inputInstitucion = document.getElementById("Institucion");
const inputArea = document.getElementById("Area");
const inputBiografia = document.getElementById("biografia");

const btnCancelar = document.getElementById("btnCancelar");


// Identificador del responsable seleccionado en el listado
const idResponsable = sessionStorage.getItem("responsableModificarId");

// Guarda la lista completa de teléfonos para no perder los adicionales
let telefonosGuardados = [];


// 2. Función para validar todos los campos vacíos
function validarCamposVacios() {
    let error = false;

    // Agrupamos los campos en un arreglo (sin el correo)
    const camposObligatorios = [
        inputNombreCompleto,
        inputTelefono,
        inputInstitucion,
        inputArea,
        inputBiografia
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


// 4. Función para cargar los datos del responsable desde el backend
async function cargarResponsableRetorno(){

    if(idResponsable === null){

        Swal.fire({
            title: "Responsable no seleccionado",
            text: "Debe seleccionar un responsable desde el listado.",
            icon: "warning",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Responsables/listarResponsables.html";
        });

        return;
    }

    try{

        const responsable = await obtenerDatos(`/api/responsables/${idResponsable}`);

        telefonosGuardados = Array.isArray(responsable.telefonos)
            ? responsable.telefonos
            : [];

        inputNombreCompleto.value = responsable.nombreCompleto || "";
        inputTelefono.value = telefonosGuardados[0] || "";
        inputInstitucion.value = responsable.institucion || "";
        inputArea.value = responsable.area || "";
        inputBiografia.value = responsable.biografia || "";

    } catch(error){

        console.error("Error al cargar responsable:", error);

        Swal.fire({
            title: "Error al cargar responsable",
            text: "No fue posible obtener la información del responsable.",
            icon: "error",
            confirmButtonText: "Volver al listado"

        }).then(function(){

            window.location.href =
                "/pages/Responsables/listarResponsables.html";
        });
    }
}


// 5. Función Principal
async function modificarResponsableRetorno() {
    // Ejecutamos las validaciones
    const errorCamposVacios = validarCamposVacios();
    const errorTelefono = validarTelefono();

    // Verificamos que no haya errores
    if (errorCamposVacios === false && errorTelefono === false) {

        // Se reemplaza el primer teléfono y se conservan los adicionales
        const telefonos = telefonosGuardados.slice();
        telefonos[0] = inputTelefono.value.trim();

        const datosActualizados = {
            nombreCompleto: inputNombreCompleto.value.trim(),
            telefonos: telefonos,
            institucion: inputInstitucion.value.trim(),
            area: inputArea.value.trim(),
            biografia: inputBiografia.value.trim()
        };

        try{

            const datosRespuesta = await actualizarDatos(`/api/responsables/${idResponsable}`, datosActualizados);

            Swal.fire({
                title: "Cambios guardados",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"

            }).then(function(){

                sessionStorage.removeItem("responsableModificarId");

                window.location.href =
                    "/pages/Responsables/listarResponsables.html";
            });

        } catch(error){

            console.error("Error al modificar responsable:", error);

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

    sessionStorage.removeItem("responsableModificarId");

    window.location.href = "/pages/Responsables/listarResponsables.html";
}

// 7. Asignación de Eventos
if(formularioResponsable){
    formularioResponsable.addEventListener("submit", function(evento) {
        evento.preventDefault();
        modificarResponsableRetorno();
    });
}

if(btnCancelar){
    btnCancelar.addEventListener("click", cancelarModificacionRetorno);
}

// Carga los datos al abrir la pantalla
document.addEventListener("DOMContentLoaded", function(){

    cargarResponsableRetorno();
});
