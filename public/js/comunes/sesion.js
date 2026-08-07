// Control de sesión del área administrativa.
//
// Antes este archivo se llamaba cerrarSesion.js y buscaba el enlace
// "Cerrar Sesión" apenas se cargaba. Ahora el menú se inserta de forma
// dinámica, así que el enlace todavía no existe en ese momento: por eso
// el botón se conecta cuando el navbar avisa que ya está listo.


// Verifica si existe una sesión activa al cargar la página
if(sessionStorage.getItem("sesionActiva") !== "true"){
    window.location.replace("/pages/DashBoard/iniciarSesion.html");
}

// Verifica sesión cuando se vuelve con la flecha atrás del navegador
window.addEventListener("pageshow", function(){
    if(sessionStorage.getItem("sesionActiva") !== "true"){
        window.location.replace("/pages/DashBoard/iniciarSesion.html");
    }
});


// Pregunta y cierra la sesión
function cerrarSesionRetorno(evento){

    evento.preventDefault();

    Swal.fire({
        title: "Cerrar sesión",
        text: "¿Está seguro que desea cerrar sesión?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "Cancelar"

    }).then(function(resultado){

        if(resultado.isConfirmed){
            sessionStorage.removeItem("sesionActiva");
            window.location.replace("/pages/DashBoard/iniciarSesion.html");
        }
    });
}


// Conecta el enlace de cerrar sesión, si ya está en la página
function conectarBotonCerrarSesion(){

    const enlaceCerrarSesion = document.getElementById("cerrarSesion");

    if(enlaceCerrarSesion === null){
        return;
    }

    enlaceCerrarSesion.addEventListener("click", cerrarSesionRetorno);
}


// El menú lateral llega después, así que se espera su aviso
document.addEventListener("navbarListo", conectarBotonCerrarSesion);

// Y por si alguna página todavía trae el menú escrito directamente
document.addEventListener("DOMContentLoaded", conectarBotonCerrarSesion);
