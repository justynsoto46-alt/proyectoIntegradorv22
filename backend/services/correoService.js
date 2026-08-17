/*
============================================================
SERVICIO DE CORREO ELECTRÓNICO
============================================================

Este archivo contiene la lógica para enviar correos por medio
de un servidor SMTP utilizando Nodemailer.

La configuración NUNCA se escribe en el código.
Se obtiene del archivo .env.

Aquí se encuentran las notificaciones de:
- RF-02: actividad cancelada
- RF-03: cambio de horario o de ubicación

Flujo:
actividadService -> correoService -> servidor SMTP
============================================================
*/

const nodemailer =
    require("nodemailer");

// Importa el servicio de acceso a datos del historial
const correoDatosService =
    require("./correoDatosService");


/*
Crea un error y le agrega el código HTTP.
*/
function crearError(mensaje, estado){

    const error =
        new Error(mensaje);

    error.status = estado;

    return error;
}


/*
Indica si las variables mínimas de correo
están configuradas en el archivo .env.

Esta función permite que el sistema siga funcionando
aunque el correo todavía no haya sido configurado.
*/
function correoEstaConfigurado(){

    if(
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASSWORD &&
        process.env.EMAIL_FROM
    ){

        return true;
    }

    return false;
}


/*
Crea el transportador de Nodemailer.

El transportador representa la conexión con el servidor SMTP
que se encarga de entregar los mensajes.
*/
function crearTransportador(){

    if(!correoEstaConfigurado()){

        throw crearError(
            "Falta configurar las variables de correo en el archivo .env.",
            503
        );
    }


    // Convierte el puerto de texto a número
    const puerto =
        Number(process.env.SMTP_PORT);


    // La variable llega como texto desde el .env,
    // por eso se convierte manualmente a booleano
    let conexionSegura = false;

    if(process.env.SMTP_SECURE === "true"){

        conexionSegura = true;
    }


    const transportador =
        nodemailer.createTransport({

            host: process.env.SMTP_HOST,
            port: puerto,
            secure: conexionSegura,

            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });


    return transportador;
}


/*
Convierte los caracteres especiales en su versión segura
para poder colocar texto dentro del correo en formato HTML.
*/
function escaparHtml(valor){

    if(valor === undefined || valor === null){

        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}


/*
Envía un correo utilizando la configuración SMTP.

Esta función concentra el envío para no repetir
el mismo código en cada tipo de notificación.
*/
async function enviarCorreo(
    baseDatos,
    destinatario,
    asunto,
    mensajeTexto,
    mensajeHtml,
    motivo
){

    const transportador =
        crearTransportador();


    try{

        const resultado =
            await transportador.sendMail({

                from: process.env.EMAIL_FROM,
                to: destinatario,
                subject: asunto,
                text: mensajeTexto,
                html: mensajeHtml
            });


        // Guarda en MongoDB que el correo se pudo enviar
        await correoDatosService.guardarHistorial(
            baseDatos,
            {
                destinatario: destinatario,
                asunto: asunto,
                motivo: motivo,
                estado: "enviado",
                identificadorMensaje: resultado.messageId,
                fechaEnvio: new Date()
            }
        );


        return resultado;

    } catch(error){

        // También se registra el intento fallido
        // para poder revisarlo después
        await correoDatosService.guardarHistorial(
            baseDatos,
            {
                destinatario: destinatario,
                asunto: asunto,
                motivo: motivo,
                estado: "fallido",
                error: error.message,
                fechaEnvio: new Date()
            }
        );

        throw error;
    }
}


/*
Construye el bloque de datos de la actividad
que aparece en el cuerpo de los correos.
*/
function construirDetalleTexto(actividad){

    const detalle =
        "Actividad: " + actividad.nombreActividad + "\n" +
        "Evento: " + actividad.eventoAsociado + "\n" +
        "Fecha: " + actividad.fecha + "\n" +
        "Hora: " + actividad.horaInicio +
        " a " + actividad.horaFin + "\n" +
        "Ubicación: " + actividad.ubicacion;

    return detalle;
}


/*
Construye el mismo bloque de datos en formato HTML.
*/
function construirDetalleHtml(actividad){

    const detalle =
        '<table style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;">' +

        '<tr><td style="padding:6px 14px 6px 0;color:#555;">Actividad</td>' +
        '<td style="padding:6px 0;"><strong>' +
        escaparHtml(actividad.nombreActividad) +
        '</strong></td></tr>' +

        '<tr><td style="padding:6px 14px 6px 0;color:#555;">Evento</td>' +
        '<td style="padding:6px 0;">' +
        escaparHtml(actividad.eventoAsociado) +
        '</td></tr>' +

        '<tr><td style="padding:6px 14px 6px 0;color:#555;">Fecha</td>' +
        '<td style="padding:6px 0;">' +
        escaparHtml(actividad.fecha) +
        '</td></tr>' +

        '<tr><td style="padding:6px 14px 6px 0;color:#555;">Hora</td>' +
        '<td style="padding:6px 0;">' +
        escaparHtml(actividad.horaInicio) + " a " +
        escaparHtml(actividad.horaFin) +
        '</td></tr>' +

        '<tr><td style="padding:6px 14px 6px 0;color:#555;">Ubicación</td>' +
        '<td style="padding:6px 0;">' +
        escaparHtml(actividad.ubicacion) +
        '</td></tr>' +

        '</table>';

    return detalle;
}


/*
Envuelve el contenido del correo con el encabezado
y el pie de la Universidad CENFOTEC.
*/
function construirPlantillaHtml(titulo, introduccion, cuerpo){

    const plantilla =
        '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;">' +

        '<h2 style="color:#164a98;margin-bottom:4px;">' +
        escaparHtml(titulo) +
        '</h2>' +

        '<p style="font-size:14px;color:#333;line-height:1.6;">' +
        escaparHtml(introduccion) +
        '</p>' +

        cuerpo +

        '<p style="font-size:12px;color:#888;margin-top:24px;">' +
        'Universidad CENFOTEC - Sistema de Eventos.<br>' +
        'Este mensaje se generó de forma automática, no responda a este correo.' +
        '</p>' +

        '</div>';

    return plantilla;
}


/*
RF-02

Envía la notificación de actividad cancelada
a un participante inscrito.
*/
async function enviarCorreoActividadCancelada(
    baseDatos,
    participante,
    actividad
){

    const asunto =
        "Actividad cancelada: " + actividad.nombreActividad;


    const introduccion =
        "Hola " + participante.nombreCompleto + ", " +
        "le informamos que la siguiente actividad en la que se encuentra " +
        "inscrito fue cancelada.";


    const mensajeTexto =
        introduccion + "\n\n" +
        construirDetalleTexto(actividad) + "\n\n" +
        "Su inscripción ya no será considerada para esta actividad.\n\n" +
        "Universidad CENFOTEC - Sistema de Eventos.";


    const mensajeHtml =
        construirPlantillaHtml(
            "Actividad cancelada",
            introduccion,
            construirDetalleHtml(actividad) +
            '<p style="font-size:14px;color:#333;line-height:1.6;">' +
            'Su inscripción ya no será considerada para esta actividad.' +
            '</p>'
        );


    await enviarCorreo(
        baseDatos,
        participante.correoElectronico,
        asunto,
        mensajeTexto,
        mensajeHtml,
        "actividad-cancelada"
    );
}


/*
RF-03

Envía la notificación de cambio de fecha, horario
o ubicación a un participante inscrito.

El parámetro "cambios" es una lista de textos que describen
lo que se modificó.
*/
async function enviarCorreoActividadModificada(
    baseDatos,
    participante,
    actividad,
    cambios
){

    const asunto =
        "Cambios en la actividad: " + actividad.nombreActividad;


    const introduccion =
        "Hola " + participante.nombreCompleto + ", " +
        "le informamos que la actividad en la que se encuentra inscrito " +
        "presenta cambios en su programación.";


    // Arma la lista de cambios en formato de texto
    let listaTexto = "";

    for(let i = 0; i < cambios.length; i++){

        listaTexto =
            listaTexto + "- " + cambios[i] + "\n";
    }


    // Arma la misma lista en formato HTML
    let listaHtml =
        '<ul style="font-size:14px;color:#333;line-height:1.6;">';

    for(let i = 0; i < cambios.length; i++){

        listaHtml =
            listaHtml + "<li>" +
            escaparHtml(cambios[i]) +
            "</li>";
    }

    listaHtml = listaHtml + "</ul>";


    const mensajeTexto =
        introduccion + "\n\n" +
        "CAMBIOS REALIZADOS\n\n" +
        listaTexto + "\n" +
        "INFORMACIÓN ACTUALIZADA\n\n" +
        construirDetalleTexto(actividad) + "\n\n" +
        "Universidad CENFOTEC - Sistema de Eventos.";


    const mensajeHtml =
        construirPlantillaHtml(
            "Cambios en la programación",
            introduccion,
            '<p style="font-size:14px;color:#164a98;margin-bottom:0;">' +
            '<strong>Cambios realizados</strong></p>' +
            listaHtml +
            '<p style="font-size:14px;color:#164a98;margin-bottom:8px;">' +
            '<strong>Información actualizada</strong></p>' +
            construirDetalleHtml(actividad)
        );


    await enviarCorreo(
        baseDatos,
        participante.correoElectronico,
        asunto,
        mensajeTexto,
        mensajeHtml,
        "actividad-modificada"
    );
}


/*
Envía un correo de prueba.

Se utiliza desde la ruta POST /api/correos/prueba
para comprobar la configuración SMTP antes de
trabajar con datos reales.
*/
async function enviarCorreoPrueba(baseDatos){

    const destinatario =
        process.env.EMAIL_TO;


    // Verifica que exista un destinatario de prueba
    if(!destinatario){

        throw crearError(
            "Debe configurar la variable EMAIL_TO en el archivo .env.",
            503
        );
    }


    const asunto =
        "Prueba de correo - Sistema de Eventos CENFOTEC";

    const mensajeTexto =
        "La configuración de correo del proyecto funciona correctamente.";

    const mensajeHtml =
        construirPlantillaHtml(
            "Prueba de correo",
            "La configuración de correo del proyecto funciona correctamente.",
            ""
        );


    const resultado =
        await enviarCorreo(
            baseDatos,
            destinatario,
            asunto,
            mensajeTexto,
            mensajeHtml,
            "prueba"
        );


    return resultado;
}


// Exporta las funciones del servicio
module.exports = {
    correoEstaConfigurado,
    enviarCorreoActividadCancelada,
    enviarCorreoActividadModificada,
    enviarCorreoPrueba
};
