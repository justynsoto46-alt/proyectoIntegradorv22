const formulario = document.getElementById("formulario");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const contrasena = document.getElementById("contrasena");
const rol = document.getElementById("rol");

function validarCamposVacios(){
    let error = false;

    if(nombre.value.trim() === ""){
        nombre.classList.add("input-error");
        error = true;
    } else {
        nombre.classList.remove("input-error");
    }

    if (correo.value.trim() === ""){
        correo.classList.add("input-error");
        error = true;
    } else {
        correo.classList.remove("input-error");
    }

    if (contrasena.value.trim() === ""){
        contrasena.classList.add("input-error");
        error = true;
    } else {
        contrasena.classList.remove("input-error");
    }

    return error;
}

function validarCorreo(){
    let error = false;
    const valorCorreo = correo.value.trim();

    if(valorCorreo.includes("@") && valorCorreo.includes(".")){
        correo.classList.remove("input-error");
    } else {
        correo.classList.add("input-error");
        error = true;
    }

    return error;
}

function validarContrasenia(){
    let error = false;
    const valorContrasena = contrasena.value.trim();

    // Mínimo 8 caracteres
    if(valorContrasena.length < 8){
        error = true;
    }

    // Máximo 16 caracteres
    if(valorContrasena.length > 16){
        error = true;
    }

    // Debe contener al menos una mayúscula
    if(!/[A-Z]/.test(valorContrasena)){
        error = true;
    }

    // Debe contener al menos una minúscula
    if(!/[a-z]/.test(valorContrasena)){
        error = true;
    }

    // Debe contener al menos un número
    if(!/[0-9]/.test(valorContrasena)){
        error = true;
    }

    // Debe contener al menos un carácter especial
    if(!/[!@#$%^&*(),.?":{}|<>]/.test(valorContrasena)){
        error = true;
    }

    // No debe contener vocales
    if(/[aeiouAEIOU]/.test(valorContrasena)){
        error = true;
    }

    if(error){
        contrasena.classList.add("input-error");
    } else {
        contrasena.classList.remove("input-error");
    }
    return error;
}


// Función principal para registrar el administrador en MongoDB
async function registrarAdministradorRetorno(){

    let errorVacios = validarCamposVacios();
    let errorFormatoCorreo = validarCorreo();
    let errorFormatoContrasena = validarContrasenia();

    if(errorVacios === false &&
       errorFormatoCorreo === false &&
       errorFormatoContrasena === false){

        // Crea el objeto con los datos ingresados en el formulario
        const administrador = {
            nombreCompleto: nombre.value.trim(),
            correo: correo.value.trim(),
            contrasena: contrasena.value.trim(),
            rol: rol.value
        };

        try{

            const datosRespuesta = await crearDatos("/api/administradores", administrador);

            Swal.fire({
                title: "Registro exitoso",
                text: datosRespuesta.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar"

            }).then(function(){

                limpiarFormulario();

                window.location.href =
                    "/pages/Administrador/listarAdmin.html";
            });

        } catch(error){

            console.error("Error al registrar administrador:", error);

            avisarError("No se pudo completar la operación", error.message);
        }

    } else {
        Swal.fire({
            title: "No se puede realizar el registro",
            text: "Por favor revise los campos marcados",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}

function limpiarFormulario(){
    // Limpia los campos de texto
    nombre.value = "";
    correo.value = "";
    contrasena.value = "";

    nombre.classList.remove("input-error");
    correo.classList.remove("input-error");
    contrasena.classList.remove("input-error");
}

formulario.addEventListener("submit", function(evento){
    // Evita que el formulario se envíe automáticamente
    evento.preventDefault();
    // Ejecuta la función principal
    registrarAdministradorRetorno();
});
