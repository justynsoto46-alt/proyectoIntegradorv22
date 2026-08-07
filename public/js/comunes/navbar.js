// Carga el menú lateral desde /partials/navbar.html y lo coloca
// dentro del <div id="navbar"> de la página.
//
// Así el menú existe una sola vez en todo el proyecto: si se agrega
// o se cambia una opción, se hace únicamente en el archivo del partial.

// Nombre del evento que se dispara cuando el menú ya está en la página.
// Otros scripts (por ejemplo el de cerrar sesión) lo escuchan para poder
// trabajar con elementos que antes no existían.
const EVENTO_NAVBAR_LISTO = "navbarListo";


// Marca como activa la opción que corresponde a la página abierta
function marcarOpcionActiva(contenedor){

    const rutaActual = window.location.pathname;

    // Toma la carpeta de la página actual, por ejemplo "/pages/Evento"
    const carpetaActual = rutaActual.substring(0, rutaActual.lastIndexOf("/"));

    const enlaces = contenedor.querySelectorAll("nav a");

    enlaces.forEach(function(enlace){

        // El enlace de cerrar sesión nunca se marca
        if(enlace.classList.contains("cerrar-sesion")){
            return;
        }

        const rutaEnlace = enlace.getAttribute("href");

        const carpetaEnlace =
            rutaEnlace.substring(0, rutaEnlace.lastIndexOf("/"));

        // Coincidencia exacta de página, o bien la misma carpeta
        // (así "Registrar Evento" también resalta la opción Eventos)
        if(rutaEnlace === rutaActual || carpetaEnlace === carpetaActual){

            enlace.classList.add("activo");
        }
    });
}


// Descarga el partial y lo inserta en el contenedor
async function cargarNavbarRetorno(){

    const contenedor = document.getElementById("navbar");

    // Si la página no tiene el contenedor, no hay nada que hacer
    if(contenedor === null){
        return;
    }

    try{

        const respuesta = await fetch("/partials/navbar.html");

        if(respuesta.ok === false){

            throw new Error("No se pudo obtener el menú lateral.");
        }

        contenedor.innerHTML = await respuesta.text();

        marcarOpcionActiva(contenedor);

        // Avisa al resto de los scripts que el menú ya está disponible
        document.dispatchEvent(new CustomEvent(EVENTO_NAVBAR_LISTO));

    } catch(error){

        console.error("Error al cargar el menú lateral:", error);
    }
}


// Carga el menú apenas la página está lista
document.addEventListener("DOMContentLoaded", cargarNavbarRetorno);
