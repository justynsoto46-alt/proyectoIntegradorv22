/*
============================================================
SERVICIO DE ACTIVIDADES
============================================================

Este archivo contiene la lógica relacionada con actividades.

Aquí NO se accede directamente a MongoDB.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");

// Importa el servicio de acceso a datos
const actividadDatosService =
    require("./actividadDatosService");

// Importa los servicios necesarios para saber
// qué participantes están inscritos en la actividad
const inscripcionDatosService =
    require("./inscripcionDatosService");

const participanteDatosService =
    require("./participanteDatosService");

// Importa el servicio de correo electrónico
const correoService =
    require("./correoService");


/*
Valida que el identificador tenga formato ObjectId.
*/
function validarId(idActividad){

    return ObjectId.isValid(
        idActividad
    );
}


/*
Registra una actividad.
*/
async function registrarActividad(
    baseDatos,
    actividad
){

    const actividadGuardada =
        await actividadDatosService.crear(
            baseDatos,
            actividad
        );

    return actividadGuardada;
}


/*
Obtiene todas las actividades.
*/
async function listarActividades(
    baseDatos
){

    return await actividadDatosService.listar(
        baseDatos
    );
}


/*
Consulta una actividad por su identificador.
*/
async function consultarActividadPorId(
    baseDatos,
    idActividad
){

    // Valida el identificador
    if(!validarId(idActividad)){

        const error =
            new Error(
                "El identificador de la actividad no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Busca la actividad
    const actividad =
        await actividadDatosService.obtener(
            baseDatos,
            idActividad
        );


    // Verifica que exista
    if(!actividad){

        const error =
            new Error(
                "No se encontró la actividad."
            );

        error.status = 404;

        throw error;
    }

    return actividad;
}


/*
============================================================
NOTIFICACIONES POR CORREO (RF-02 y RF-03)
============================================================
*/


/*
Obtiene los participantes inscritos en una actividad.

Solo devuelve los que tienen un correo registrado,
porque son los únicos que pueden ser notificados.
*/
async function obtenerParticipantesInscritos(
    baseDatos,
    idActividad
){

    // Busca todas las inscripciones de la actividad
    const inscripciones =
        await inscripcionDatosService
            .listarPorActividad(
                baseDatos,
                idActividad
            );


    // Arreglo donde se guardarán los participantes
    const participantes = [];


    // Recorre las inscripciones encontradas
    for(
        const inscripcion
        of inscripciones
    ){

        // Busca el participante relacionado
        const participante =
            await participanteDatosService.obtener(
                baseDatos,
                inscripcion.participanteId.toString()
            );


        // Verifica que exista y que tenga correo
        if(
            participante &&
            participante.correoElectronico
        ){

            participantes.push(
                participante
            );
        }
    }


    return participantes;
}


/*
Compara la actividad anterior contra los cambios recibidos
y devuelve una lista con los cambios de programación.

Se revisan la fecha, la hora de inicio, la hora de
finalización y la ubicación.
*/
function obtenerCambiosDeProgramacion(
    actividadAnterior,
    cambios
){

    // Lista con los textos que se mostrarán en el correo
    const descripciones = [];


    // Revisa la fecha
    if(
        cambios.fecha !== undefined &&
        cambios.fecha !== actividadAnterior.fecha
    ){

        descripciones.push(
            "La fecha cambió del " +
            actividadAnterior.fecha +
            " al " +
            cambios.fecha +
            "."
        );
    }


    // Revisa la hora de inicio
    if(
        cambios.horaInicio !== undefined &&
        cambios.horaInicio !== actividadAnterior.horaInicio
    ){

        descripciones.push(
            "La hora de inicio cambió de las " +
            actividadAnterior.horaInicio +
            " a las " +
            cambios.horaInicio +
            "."
        );
    }


    // Revisa la hora de finalización
    if(
        cambios.horaFin !== undefined &&
        cambios.horaFin !== actividadAnterior.horaFin
    ){

        descripciones.push(
            "La hora de finalización cambió de las " +
            actividadAnterior.horaFin +
            " a las " +
            cambios.horaFin +
            "."
        );
    }


    // Revisa la ubicación
    if(
        cambios.ubicacion !== undefined &&
        cambios.ubicacion !== actividadAnterior.ubicacion
    ){

        descripciones.push(
            "La ubicación cambió de " +
            actividadAnterior.ubicacion +
            " a " +
            cambios.ubicacion +
            "."
        );
    }


    return descripciones;
}


/*
Indica si la actividad pasó a estar cancelada.

Solo se considera cancelación cuando el estado anterior
era diferente, para no notificar dos veces si el
administrador vuelve a guardar la misma actividad.
*/
function seCancelo(actividadAnterior, cambios){

    if(
        cambios.estado === "Cancelada" &&
        actividadAnterior.estado !== "Cancelada"
    ){

        return true;
    }

    return false;
}


/*
Envía las notificaciones que correspondan.

Esta función se ejecuta DESPUÉS de guardar los cambios
y nunca detiene la modificación de la actividad:
si el correo falla, el error solo se registra en consola.

Cuando la actividad se cancela se envía únicamente
el correo de cancelación, aunque también haya cambiado
el horario o la ubicación.
*/
async function notificarCambiosDeActividad(
    baseDatos,
    idActividad,
    actividadAnterior,
    cambios
){

    // Si el correo no está configurado no se hace nada
    if(!correoService.correoEstaConfigurado()){

        console.log(
            "Correo no configurado: no se enviaron notificaciones."
        );

        return;
    }


    // Determina qué ocurrió con la actividad
    const actividadCancelada =
        seCancelo(
            actividadAnterior,
            cambios
        );

    const cambiosProgramacion =
        obtenerCambiosDeProgramacion(
            actividadAnterior,
            cambios
        );


    // Si no hubo cancelación ni cambios de programación,
    // no se envía ninguna notificación
    if(
        actividadCancelada === false &&
        cambiosProgramacion.length === 0
    ){

        return;
    }


    // Une la información anterior con los cambios para
    // mostrar los datos actualizados dentro del correo
    const actividadActualizada =
        Object.assign(
            {},
            actividadAnterior,
            cambios
        );


    // Busca los participantes inscritos
    const participantes =
        await obtenerParticipantesInscritos(
            baseDatos,
            idActividad
        );


    // Si no hay inscritos no hay a quién notificar
    if(participantes.length === 0){

        return;
    }


    // Recorre los participantes y envía el correo
    for(
        const participante
        of participantes
    ){

        try{

            if(actividadCancelada){

                // RF-02
                await correoService
                    .enviarCorreoActividadCancelada(
                        baseDatos,
                        participante,
                        actividadActualizada
                    );

            } else{

                // RF-03
                await correoService
                    .enviarCorreoActividadModificada(
                        baseDatos,
                        participante,
                        actividadActualizada,
                        cambiosProgramacion
                    );
            }

        } catch(error){

            // El fallo de un correo no debe detener los demás
            console.error(
                "No se pudo notificar a " +
                participante.correoElectronico + ":",
                error.message
            );
        }
    }


    console.log(
        "Notificaciones procesadas para " +
        participantes.length +
        " participante(s) de la actividad " +
        idActividad
    );
}


/*
Modifica una actividad.
*/
async function modificarActividad(
    baseDatos,
    idActividad,
    cambios
){

    // Valida el identificador
    if(!validarId(idActividad)){

        const error =
            new Error(
                "El identificador de la actividad no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Verifica que la actividad exista
    const actividad =
        await actividadDatosService.obtener(
            baseDatos,
            idActividad
        );


    if(!actividad){

        const error =
            new Error(
                "No se encontró la actividad."
            );

        error.status = 404;

        throw error;
    }


    // Realiza la modificación
    const resultado =
        await actividadDatosService.modificar(
            baseDatos,
            idActividad,
            cambios
        );


    /*
    RF-02 y RF-03

    Una vez guardados los cambios se avisa por correo a los
    participantes inscritos.

    El envío NO se espera con await a propósito: los correos
    pueden tardar varios segundos y la pantalla del
    administrador no debe quedarse esperando. Si algo falla,
    el error se muestra en la consola del servidor y la
    modificación de la actividad se mantiene.
    */
    notificarCambiosDeActividad(
        baseDatos,
        idActividad,
        actividad,
        cambios

    ).catch(function(error){

        console.error(
            "Error al enviar las notificaciones de la actividad:",
            error
        );
    });


    return resultado;
}


/*
Elimina una actividad.
*/
async function eliminarActividad(
    baseDatos,
    idActividad
){

    // Valida el identificador
    if(!validarId(idActividad)){

        const error =
            new Error(
                "El identificador de la actividad no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Verifica que exista
    const actividad =
        await actividadDatosService.obtener(
            baseDatos,
            idActividad
        );


    if(!actividad){

        const error =
            new Error(
                "No se encontró la actividad."
            );

        error.status = 404;

        throw error;
    }


    // Elimina la actividad
    return await actividadDatosService.eliminar(
        baseDatos,
        idActividad
    );
}


// Exporta las funciones del servicio
module.exports = {
    registrarActividad,
    listarActividades,
    consultarActividadPorId,
    modificarActividad,
    eliminarActividad
};