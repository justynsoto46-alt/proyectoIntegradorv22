// Para obtener los elementos del formulario de inicio de sesión
const formulario = document.getElementById("formulario");
const inputCorreo = document.getElementById("correo");
const inputContrasenia = document.getElementById("contrasenia");

// Administrador temporal para pruebas de la primera iteración
const correoAdministrador = "admin@ucenfotec.ac.cr";
const contraseniaAdministrador = "Hwk$2026";

// Funciones

// Validar campos
function validarCamposVacios(){

    let error = false;

    // Si usuario está vacío
    if(inputCorreo.value.trim() === ""){
        inputCorreo.classList.add("input-error");

        Swal.fire({
            title: "Campo vacío",
            text: "Ingrese un correo electrónico para poder continuar.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

        error = true;
    } else {
        inputCorreo.classList.remove("input-error");
    }

    // Si contrasenia está vacía
    if(inputContrasenia.value.trim() === ""){
        inputContrasenia.classList.add("input-error");

        Swal.fire({
            title: "Campo vacío",
            text: "Ingrese una contraseña para poder continuar.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    
        error = true;
    } else {
        inputContrasenia.classList.remove("input-error");
    }

    return error;
}

// Validar si correo cumple con el formato
function validarCorreo(){

    let error = false;
    const correo = inputCorreo.value.trim();

    // El correo no debe estar vacío
    if(correo === ""){
        error = true;
    }

    // El correo no debe contener espacios
    if(correo.includes(" ")){
        error = true;
    }

    // El correo debe contener @ y .
    if(!correo.includes("@") || !correo.includes(".")){
        error = true;
    }

    if(error){

        inputCorreo.classList.add("input-error");

        Swal.fire({
            title: "Correo inválido",
            text: "Ingrese un correo electrónico válido y sin espacios.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

    } else{

        inputCorreo.classList.remove("input-error");
    }
    return error;
}

// Validar contrasenia
function validarContrasenia(){
    
    let error = false;
    const contrasenia = inputContrasenia.value.trim();

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
        inputContrasenia.classList.add("input-error");

        Swal.fire({
        title: "Contraseña inválida",
        text: "La contraseña debe cumplir con los requisitos de seguridad establecidos.",
        icon: "warning",
        confirmButtonText: "Aceptar"
        });

    } else {
        inputContrasenia.classList.remove("input-error");
    }
    return error;
}

// Validar credenciales temporalmente
function validarCredenciales(){

    let correo = inputCorreo.value.trim();
    const contrasenia = inputContrasenia.value.trim();

    if(correo === correoAdministrador && contrasenia === contraseniaAdministrador){
        inputCorreo.classList.remove("input-error");
        inputContrasenia.classList.remove("input-error");
        return true;
    } else {
        inputCorreo.classList.add("input-error");
        inputContrasenia.classList.add("input-error");
        return false;
    }
}

// Limpiar el formulario
function limpiarFormulario(){
    inputCorreo.value = "";
    inputContrasenia.value = "";

    inputCorreo.classList.remove("input-error");
    inputContrasenia.classList.remove("input-error");
}

// Función principal
function iniciarSesionRetorno(){

    if(validarCamposVacios() === false &&
       validarCorreo() === false &&
       validarContrasenia() === false){

        if(validarCredenciales()){

                limpiarFormulario();

                // Se almacena una sesión temporal para permitir el acceso al menú principal
                sessionStorage.setItem("sesionActiva", "true");

                // Redirecciona al menú principal del sistema
                window.location.replace("/pages/DashBoard/menuPrincipal.html");
        }
        else{
            Swal.fire({
                title: "Credenciales incorrectas",
                text: "El correo o la contraseña no son válidos",
                icon: "error",
                confirmButtonText: "Aceptar"
            });

            limpiarFormulario()
        }
    }
}

// Evento Final
formulario.addEventListener("submit", function(evento) { // Escucha cuando se envia el form, "submit": Cuando presiona enter o el botón
    evento.preventDefault(); // Evita que se recargue la página
    iniciarSesionRetorno(); // Ejecuta la función principal
});