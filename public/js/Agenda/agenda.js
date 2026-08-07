console.log("JS cargado correctamente");

const eventos = document.querySelectorAll(".evento");
const detalleEvento = document.getElementById("detalleEvento");

const detalleActividad = document.getElementById("detalleActividad");
const detalleFecha = document.getElementById("detalleFecha");
const detalleInicio = document.getElementById("detalleInicio");
const detalleFin = document.getElementById("detalleFin");
const detalleResponsable = document.getElementById("detalleResponsable");


function mostrarDetalle(evento){

    detalleActividad.textContent = evento.dataset.actividad;
    detalleFecha.textContent = evento.dataset.fecha;
    detalleInicio.textContent = evento.dataset.inicio;
    detalleFin.textContent = evento.dataset.fin;
    detalleResponsable.textContent = evento.dataset.responsable;

    detalleEvento.style.display = "block";

}


eventos.forEach(function(evento){

    evento.addEventListener("click", function(){

        mostrarDetalle(evento);

    });

});