// Sugerencia de descripción con inteligencia artificial.
//
// Este archivo conecta el botón "Mejorar con IA" que aparece
// junto al campo de descripción en las pantallas de eventos
// y actividades.
//
// La sugerencia nunca reemplaza el texto de forma automática:
// primero se muestra al administrador para que decida si la
// utiliza o si conserva la que escribió.

import {
    mejorarDescripcion
} from "../services/geminiService.js";


// Se obtienen los elementos de la pantalla
const botonMejorar =
    document.getElementById("botonMejorarDescripcion");

const campoDescripcion =
    document.getElementById("descripcion");


// Construye el cuadro que muestra la sugerencia.
//
// Se arma con textContent y no con HTML directo para que
// el texto devuelto por Gemini siempre se muestre como texto.
function construirCuadroSugerencia(textoSugerido){

    const contenedor =
        document.createElement("div");

    contenedor.style.textAlign = "left";


    const parrafo =
        document.createElement("p");

    parrafo.textContent = textoSugerido;

    parrafo.style.margin = "0";
    parrafo.style.lineHeight = "1.6";
    parrafo.style.whiteSpace = "pre-wrap";


    contenedor.appendChild(parrafo);

    return contenedor;
}


// Solicita la sugerencia y la muestra en pantalla
async function mejorarDescripcionRetorno(){

    // Obtiene el tipo desde el atributo del botón
    const tipo =
        botonMejorar.dataset.tipo;


    // Obtiene el campo que contiene el nombre
    const campoNombre =
        document.getElementById(
            botonMejorar.dataset.campoNombre
        );


    // Obtiene el campo de categoría, si la pantalla lo tiene
    let categoria = "";

    if(botonMejorar.dataset.campoCategoria){

        const campoCategoria =
            document.getElementById(
                botonMejorar.dataset.campoCategoria
            );

        if(campoCategoria){

            categoria = campoCategoria.value;
        }
    }


    // Verifica que exista el nombre
    if(
        campoNombre === null ||
        campoNombre.value.trim() === ""
    ){

        avisarAdvertencia(
            "Falta el nombre",
            "Escriba primero el nombre para que la sugerencia tenga contexto."
        );

        return;
    }


    // Verifica que exista una descripción para mejorar
    if(campoDescripcion.value.trim().length < 10){

        avisarAdvertencia(
            "Descripción muy corta",
            "Escriba al menos 10 caracteres para poder mejorar el texto."
        );

        return;
    }


    // Evita que se envíen varias solicitudes seguidas
    botonMejorar.disabled = true;


    // Muestra el aviso mientras se espera la respuesta
    Swal.fire({
        title: "Generando sugerencia",
        text: "Esperando la respuesta de la inteligencia artificial.",
        allowOutsideClick: false,

        didOpen: function(){

            Swal.showLoading();
        }
    });


    try{

        // Solicita la mejora por medio del service
        const respuesta =
            await mejorarDescripcion({

                tipo: tipo,
                nombre: campoNombre.value.trim(),
                categoria: categoria,
                descripcion: campoDescripcion.value.trim()
            });


        // Cierra el aviso de espera
        Swal.close();


        // Muestra la sugerencia y deja decidir al administrador
        const resultado =
            await Swal.fire({

                title: "Sugerencia de la IA",
                html: construirCuadroSugerencia(
                    respuesta.descripcionMejorada
                ),
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Usar esta descripción",
                cancelButtonText: "Conservar la mía",
                width: "40rem"
            });


        // Solo reemplaza el texto si el administrador acepta
        if(resultado.isConfirmed){

            campoDescripcion.value =
                respuesta.descripcionMejorada;

            campoDescripcion.classList.remove("input-error");
        }

    } catch(error){

        console.error(
            "Error al mejorar la descripción:",
            error
        );

        Swal.close();

        avisarError(
            "No se pudo mejorar la descripción",
            error.message
        );

    } finally{

        // Vuelve a habilitar el botón
        botonMejorar.disabled = false;
    }
}


// Conecta el botón solo si la pantalla lo tiene
if(
    botonMejorar !== null &&
    campoDescripcion !== null
){

    botonMejorar.addEventListener(
        "click",
        mejorarDescripcionRetorno
    );
}
