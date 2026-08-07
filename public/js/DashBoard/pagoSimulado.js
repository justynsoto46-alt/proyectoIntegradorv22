const formularioPago = document.getElementById("formPago");
const inputPrecio = document.getElementById("precio"); // Se eliminó la barra inclinada (/)

function validarCamposVacios() {
    let error = false;
    if (inputPrecio.value.trim() === "") {
        inputPrecio.classList.add("input-error");
        error = true;
    } else {
        inputPrecio.classList.remove("input-error");
    }

    return error;
}

function registrarPagoRetorno() {
    
    let errorVacio = validarCamposVacios();

    if (errorVacio) {
        Swal.fire({
            title: "Datos incompletos o inválidos",
            text: "Por favor revise los campos marcados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });

    } else {
        Swal.fire({
            title: "¡Precio Ajustado!", 
            text: "El precio fue guardado exitosamente.", 
            icon: "success",
            confirmButtonText: "Volver a pagos"
        }).then((resultado) => {
            if (resultado.isConfirmed) {
                window.location.href = "/pages/DashBoard/pagoSimulado.html";
            }
        });
    }
}