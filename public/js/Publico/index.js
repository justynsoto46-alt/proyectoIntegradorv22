// Se obtienen los botones de las actividades destacadas
const btnActividadUno = document.querySelector(".btn-actividad-uno");
const btnActividadDos = document.querySelector(".btn-actividad-dos");
const btnActividadTres = document.querySelector(".btn-actividad-tres");

// Se obtienen los botones de los stands participantes
const btnStandUno = document.querySelector(".btn-stand-uno");
const btnStandDos = document.querySelector(".btn-stand-dos");
const btnStandTres = document.querySelector(".btn-stand-tres");


// Función para mostrar la información de la primera actividad
function mostrarActividadUnoRetorno(){

    Swal.fire({
        title: "¿Cómo transformar datos en movimiento físico en tiempo real?",
        html: `
            <p><strong>Tipo:</strong> Charla</p>
            <p><strong>Fecha:</strong> Domingo 28 de junio de 2026</p>
            <p><strong>Horario:</strong> 9:30 a.m. - 10:00 a.m.</p>
            <p>
                En esta charla se explicará cómo utilizar datos obtenidos
                mediante sensores para generar movimientos físicos en tiempo real.
            </p>
        `,
        icon: "info",
        confirmButtonText: "Cerrar"
    });
}

// Función para mostrar la información de la segunda actividad
function mostrarActividadDosRetorno(){

    Swal.fire({
        title: "Impresión 3D: una tecnología para todos y todas",
        html: `
            <p><strong>Tipo:</strong> Taller</p>
            <p><strong>Fecha:</strong> Domingo 28 de junio de 2026</p>
            <p><strong>Horario:</strong> 10:00 a.m. - 12:00 p.m.</p>
            <p>
                Taller introductorio donde los participantes conocerán
                el funcionamiento básico de la impresión 3D y algunas
                de sus aplicaciones.
            </p>
        `,
        icon: "info",
        confirmButtonText: "Cerrar"
    });
}

// Función para mostrar la información de la tercera actividad
function mostrarActividadTresRetorno(){

    Swal.fire({
        title: "Primeros pasos con la placa microcontroladora IdeaBoard",
        html: `
            <p><strong>Tipo:</strong> Taller</p>
            <p><strong>Fecha:</strong> Domingo 28 de junio de 2026</p>
            <p><strong>Horario:</strong> 10:00 a.m. - 12:00 p.m.</p>
            <p>
                Taller práctico para conocer el funcionamiento básico
                de la placa IdeaBoard y realizar los primeros ejercicios
                con sensores y componentes electrónicos.
            </p>
        `,
        icon: "info",
        confirmButtonText: "Cerrar"
    });
}

// Función para mostrar la información del stand Microsoft
function mostrarStandUnoRetorno(){

    Swal.fire({
        title: "Microsoft Costa Rica",
        html: `
            <p><strong>Ubicación:</strong> Pabellón A</p>
            <p><strong>Horario:</strong> 9:00 a.m. - 5:00 p.m.</p>
            <p><strong>Categoría:</strong> Tecnología y Computación en la Nube</p>

            <p>
                Conozca las oportunidades de certificación, programas
                académicos, pasantías y oportunidades laborales que
                Microsoft ofrece para estudiantes y profesionales.
            </p>
        `,
        icon: "info",
        confirmButtonText: "Cerrar"
    });

}

// Función para mostrar la información del stand CINDE
function mostrarStandDosRetorno(){

    Swal.fire({
        title: "CINDE",
        html: `
            <p><strong>Ubicación:</strong> Pabellón B</p>
            <p><strong>Horario:</strong> 9:00 a.m. - 5:00 p.m.</p>
            <p><strong>Categoría:</strong> Empleo y Desarrollo Profesional</p>

            <p>
                Reciba información sobre oportunidades laborales,
                crecimiento profesional y empresas multinacionales
                del sector tecnológico en Costa Rica.
            </p>
        `,
        icon: "info",
        confirmButtonText: "Cerrar"
    });

}

// Función para mostrar la información del stand GBM
function mostrarStandTresRetorno(){

    Swal.fire({
        title: "GBM Costa Rica",
        html: `
            <p><strong>Ubicación:</strong> Pabellón C</p>
            <p><strong>Horario:</strong> 9:00 a.m. - 5:00 p.m.</p>
            <p><strong>Categoría:</strong> Soluciones Empresariales</p>

            <p>
                Descubra soluciones empresariales, infraestructura
                tecnológica, servicios en la nube y programas dirigidos
                a estudiantes y futuros profesionales.
            </p>
        `,
        icon: "info",
        confirmButtonText: "Cerrar"
    });

}

// Evento para mostrar la primera actividad
btnActividadUno.addEventListener("click", function(){
    mostrarActividadUnoRetorno();
});

// Evento para mostrar la segunda actividad
btnActividadDos.addEventListener("click", function(){
    mostrarActividadDosRetorno();
});

// Evento para mostrar la tercera actividad
btnActividadTres.addEventListener("click", function(){
    mostrarActividadTresRetorno();
});

// Evento para mostrar el primer stand
btnStandUno.addEventListener("click", function(){
    mostrarStandUnoRetorno();
});

// Evento para mostrar el segundo stand
btnStandDos.addEventListener("click", function(){
    mostrarStandDosRetorno();
});

// Evento para mostrar el tercer stand
btnStandTres.addEventListener("click", function(){
    mostrarStandTresRetorno();
});