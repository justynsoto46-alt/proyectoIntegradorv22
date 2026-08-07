const formularioStand = document.getElementById('formularioStand');
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo');
const inputTelefono = document.getElementById('telefono');

// Textarea
const textareaDescripcion = document.getElementById('descripcion');

const selectEvento = document.getElementById('evento');
const selectResponsable = document.getElementById('responsable');


function validarCamposVacios(){
    let error = false;

    if (inputNombre.value.trim() === ""){
        inputNombre.classList.add("input-error");
        error = true;
    } else {
        inputNombre.classList.remove("input-error");
    }

    if (inputCorreo.value.trim() === ""){
        inputCorreo.classList.add("input-error");
        error = true;
    } else {
        inputCorreo.classList.remove("input-error")
    }

    if (inputTelefono.value.trim() ===""){
        inputTelefono.classList.add("input-error")
        error = true;
    } else {
        inputTelefono.classList.remove("input-error");
    }

    return error;
}

function validarTelefono(){
    const telefono = inputTelefono.value.trim();

    // Debe ser exactamente 8 dígitos (solo números)
    const error = !/^\d{8}$/.test(telefono);

    if(error){
        inputTelefono.classList.add("input-error");
    } else {
        inputTelefono.classList.remove("input-error");
    }

    return error;
}

function validarCorreo(){

    let error = false;
    const correo = inputCorreo.value.trim();

    if(correo.includes("@") && correo.includes(".")){
        inputCorreo.classList.remove("input-error");
    } else{
        inputCorreo.classList.add("input-error");
        error = true;
    }

    return error;
}

// Verifica que se haya elegido un evento y un responsable
function validarSelecciones(){

    let error = false;

    if(selectEvento.value === "" || selectEvento.value === "defecto"){
        selectEvento.classList.add("input-error");
        error = true;
    } else {
        selectEvento.classList.remove("input-error");
    }

    if(selectResponsable.value === "" || selectResponsable.value === "defecto"){
        selectResponsable.classList.add("input-error");
        error = true;
    } else {
        selectResponsable.classList.remove("input-error");
    }

    return error;
}


// Llena la lista de eventos con los que existen en la base de datos
async function cargarEventosRetorno(){

    try{

        const eventos = await obtenerDatos("/api/eventos");

        selectEvento.innerHTML =
            '<option value="">Seleccione una Opcion</option>';

        eventos.forEach(function(evento){

            const opcion = document.createElement("option");

            opcion.value = evento.nombreEvento;
            opcion.textContent = evento.nombreEvento;

            selectEvento.appendChild(opcion);
        });

    } catch(error){

        console.error("Error al cargar eventos:", error);
    }
}


// Llena la lista de responsables con los que existen en la base de datos
async function cargarResponsablesRetorno(){

    try{

        const responsables = await obtenerDatos("/api/responsables");

        selectResponsable.innerHTML =
            '<option value="">Seleccione una Opcion</option>';

        responsables.forEach(function(responsable){

            const opcion = document.createElement("option");

            opcion.value = responsable.nombreCompleto;
            opcion.textContent = responsable.nombreCompleto;

            selectResponsable.appendChild(opcion);
        });

    } catch(error){

        console.error("Error al cargar responsables:", error);
    }
}


// Función principal para registrar el stand en MongoDB
async function registrarStandRetorno(){

    if(validarCamposVacios() === false &&
       validarCorreo() === false &&
       validarTelefono() === false &&
       validarSelecciones() === false){

        // Crea el objeto con los datos ingresados en el formulario.
        // El responsable elegido es quien queda como encargado del stand.
        const stand = {
            evento: selectEvento.value,
            nombre: inputNombre.value.trim(),
            encargado: selectResponsable.value,
            correo: inputCorreo.value.trim(),
            telefono: inputTelefono.value.trim(),
            descripcion: textareaDescripcion.value.trim()
        };

        try{

            const datosRespuesta = await crearDatos("/api/stands", stand);

            Swal.fire({
                title: "Registro exitoso",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"

            }).then(function(){

                limpiarFormulario();

                window.location.href = "/pages/Stands/listarStands.html";
            });

        } catch(error){

            console.error("Error al registrar stand:", error);

            avisarError("No se pudo completar la operación", error.message);
        }
    }
    else{
        Swal.fire({
            title: "No se puede realizar el registro",
            text: "Por favor revise los campos marcados",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}

// Función para limpiar el formulario
function limpiarFormulario(){

    // Limpia los campos de texto
    inputNombre.value = "";
    inputCorreo.value = "";
    inputTelefono.value = "";
    textareaDescripcion.value = "";

    // Elimina el estilo de error de los campos
    inputNombre.classList.remove("input-error");
    inputCorreo.classList.remove("input-error");
    inputTelefono.classList.remove("input-error");
}

// Evento que se ejecuta cuando el usuario intenta registrar el stand
formularioStand.addEventListener("submit", function(evento){

    // Evita que el formulario se envíe automáticamente
    evento.preventDefault();

    // Ejecuta la función principal
    registrarStandRetorno();
});

// Carga las listas desplegables al abrir la pantalla
document.addEventListener("DOMContentLoaded", function(){

    cargarEventosRetorno();
    cargarResponsablesRetorno();
});
