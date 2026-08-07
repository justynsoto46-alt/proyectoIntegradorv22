// Variables para obtener los elementos del formulario de inicio de sesión
const formulario = document.getElementById("formulario");
const inputCorreo = document.getElementById("correo");
const inputNuevaContrasenia = document.getElementById("nuevaContrasenia");
const inputConfirmarContrasenia = document.getElementById("confirmarContrasenia");

// Funciones

// Validar campos vacíos
function validarCamposVacios(){

    const correo = inputCorreo.value.trim();
    const nuevaContrasenia = inputNuevaContrasenia.value.trim();
    const confirmarContrasenia = inputConfirmarContrasenia.value.trim();

    let error = false;

    // Si correo está vacío
    if(correo === ""){
        inputCorreo.classList.add("input-error");
        error = true;
    } else {
        inputCorreo.classList.remove("input-error");
    }

    // Si nuevaContrasenia está vacía
    if(nuevaContrasenia === ""){
        inputNuevaContrasenia.classList.add("input-error");
        error = true;
    } else {
        inputNuevaContrasenia.classList.remove("input-error");
    }

    // Si confirmarContrasenia está vacío
    if(confirmarContrasenia === ""){
        inputConfirmarContrasenia.classList.add("input-error")
        error = true;
    } else {
        inputConfirmarContrasenia.classList.remove("input-error")
    }
    
    return error;
}

// Validar si correo cumple con el formato
function validarCorreo(){

    let error = false;
    const correo = inputCorreo.value.trim();

    if(correo.includes("@") && correo.includes(".")){
        inputCorreo.classList.remove("input-error");
        error = false;
    } else {
        inputCorreo.classList.add("input-error");
        error = true;
    }
    return error;
}

// Validar contrasenia
function validarContrasenia(){
    
    let error = false;
    const contrasenia = inputNuevaContrasenia.value.trim();

    // Mínimo 8 caracteres
    if(contrasenia.length < 8){
        error = true;
    }

    // Máximo 16 caracteres
    if(contrasenia.length > 16){
        error = true;
    }

    // Debe contener al menos una mayúscula
    if(!/[A-Z]/.test(contrasenia)){
        error = true;
    }

    // Debe contener al menos una minúscula
    if(!/[a-z]/.test(contrasenia)){
        error = true;
    }

    // Debe contener al menos un número
    if(!/[0-9]/.test(contrasenia)){
        error = true;
    }

    // Debe contener al menos un carácter especial
    if(!/[!@#$%^&*(),.?":{}|<>]/.test(contrasenia)){
        error = true;
    }

    // No debe contener vocales
    if(/[aeiouAEIOU]/.test(contrasenia)){
        error = true;
    }

    if(error){
        inputNuevaContrasenia.classList.add("input-error");
    } else {
        inputNuevaContrasenia.classList.remove("input-error");
    }
    return error;
}

// Confirmación de Contraseña
function validarConfirmacionContrasenia(){

    let contrasenia = inputNuevaContrasenia.value.trim();
    const confirmarContrasenia = inputConfirmarContrasenia.value.trim();

    error = false;

    if(contrasenia === confirmarContrasenia){
        inputConfirmarContrasenia.classList.remove("input-error");
        error = false;
    } else {
        inputConfirmarContrasenia.classList.add("input-error");
        error = true;
    }
    return error;
}

// Limpiar el formulario
function limpiarFormulario(){
    inputCorreo.value = "";
    inputNuevaContrasenia.value = "";
    inputConfirmarContrasenia.value = "";

    inputCorreo.classList.remove("input-error");
    inputNuevaContrasenia.classList.remove("input-error");
    inputConfirmarContrasenia.classList.remove("input-error");
}

// Función Principal
function modificarContraseniaRetorno(){
    if(validarCamposVacios() === false && validarCorreo() === false &&
       validarContrasenia() === false && validarConfirmacionContrasenia() === false){
        Swal.fire({
            title: "Cambio de contraseña exitoso",
            text: "El cambio de su contraseña ha sido exitoso.",
            icon: "success",
            confirmButtonText: "Aceptar"
        }).then(() => {

            limpiarFormulario();

            // Redirección al inicio de sesión
            window.location.href = "/pages/DashBoard/iniciarSesion.html";

        });

    } else {
        Swal.fire({
            title: "No se puede restablecer su contraseña",
            text: "Por favor revise los campos marcados",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}

// Evento Final
formulario.addEventListener("submit", function(evento) { // Escucha cuando se envia el form, "submit": Cuando presiona enter o el botón
    evento.preventDefault(); // Evita que se recargue la página
    modificarContraseniaRetorno();
});