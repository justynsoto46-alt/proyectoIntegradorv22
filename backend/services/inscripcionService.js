/*
============================================================
SERVICIO DE INSCRIPCIONES
============================================================

Este archivo contiene la lógica relacionada
con las inscripciones a actividades.

Aquí NO se accede directamente a MongoDB.

Flujo:
Controller -> Service -> DatosService -> MongoDB
============================================================
*/

const { ObjectId } = require("mongodb");


// Importa el servicio de acceso a datos
// de las inscripciones
const inscripcionDatosService =
    require("./inscripcionDatosService");


// Importa los servicios de acceso a datos
// necesarios para verificar que el participante
// y la actividad existan
const participanteDatosService =
    require("./participanteDatosService");

const actividadDatosService =
    require("./actividadDatosService");


/*
Valida que un identificador tenga
el formato correcto de ObjectId.
*/
function validarId(id){

    return ObjectId.isValid(id);
}

/*
Registra una inscripción.
*/
async function registrarInscripcion(
    baseDatos,
    inscripcion
){

    const participanteId =
        inscripcion.participanteId.toString();

    const actividadId =
        inscripcion.actividadId.toString();


    // Verifica que los identificadores
    // tengan un formato válido
    if(
        !validarId(participanteId) ||
        !validarId(actividadId)
    ){

        const error =
            new Error(
                "Los datos de la inscripción no son válidos."
            );

        error.status = 400;

        throw error;
    }


    // Verifica que el participante exista
    const participante =
        await participanteDatosService.obtener(
            baseDatos,
            participanteId
        );


    if(!participante){

        const error =
            new Error(
                "No se encontró el participante."
            );

        error.status = 404;

        throw error;
    }


    // Verifica que la actividad exista
    const actividad =
        await actividadDatosService.obtener(
            baseDatos,
            actividadId
        );


    if(!actividad){

        const error =
            new Error(
                "No se encontró la actividad."
            );

        error.status = 404;

        throw error;
    }


    // Verifica que existan cupos disponibles
    if(
        actividad.cupo === undefined ||
        Number(actividad.cupo) <= 0
    ){

        const error =
            new Error(
                "La actividad ya no cuenta con cupos disponibles."
            );

        error.status = 409;

        throw error;
    }


    // Busca si el participante ya está
    // inscrito en esta actividad
    const inscripcionExistente =
        await inscripcionDatosService
            .obtenerPorParticipanteYActividad(
                baseDatos,
                participanteId,
                actividadId
            );


    if(inscripcionExistente){

        const error =
            new Error(
                "El participante ya se encuentra inscrito en esta actividad."
            );

        error.status = 409;

        throw error;
    }


    // Obtiene todas las inscripciones
    // actuales del participante
    const inscripcionesParticipante =
        await inscripcionDatosService
            .listarPorParticipante(
                baseDatos,
                participanteId
            );


    // Recorre las inscripciones existentes
    // para verificar conflictos de horario
    for(
        const inscripcionActual
        of inscripcionesParticipante
    ){

        // Obtiene la actividad relacionada
        // con la inscripción actual
        const actividadActual =
            await actividadDatosService.obtener(
                baseDatos,
                inscripcionActual
                    .actividadId
                    .toString()
            );


        // Si la actividad ya no existe,
        // continúa con la siguiente
        if(!actividadActual){

            continue;
        }


        // Solo existe choque si las actividades
        // se realizan el mismo día
        if(
            actividadActual.fecha !==
            actividad.fecha
        ){

            continue;
        }


        // Verifica si los horarios se traslapan
        const existeChoque =
            actividad.horaInicio <
                actividadActual.horaFin &&
            actividad.horaFin >
                actividadActual.horaInicio;


        if(existeChoque){

            const error =
                new Error(
                    "La actividad seleccionada tiene un conflicto de horario con otra inscripción."
                );

            error.status = 409;

            throw error;
        }
    }


    // Guarda la inscripción
    const inscripcionGuardada =
        await inscripcionDatosService.crear(
            baseDatos,
            inscripcion
        );


    // Calcula el nuevo cupo disponible
    const nuevoCupo =
        Number(actividad.cupo) - 1;


    // Actualiza el cupo de la actividad
    await actividadDatosService.actualizarCupo(
        baseDatos,
        actividadId,
        nuevoCupo
    );


    // Devuelve la inscripción registrada
    return inscripcionGuardada;
}


/*
Obtiene las inscripciones de un participante.
*/
async function listarInscripcionesPorParticipante(
    baseDatos,
    participanteId
){

    if(!validarId(participanteId)){

        const error =
            new Error(
                "El identificador del participante no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Verifica que el participante exista
    const participante =
        await participanteDatosService.obtener(
            baseDatos,
            participanteId
        );


    if(!participante){

        const error =
            new Error(
                "No se encontró el participante."
            );

        error.status = 404;

        throw error;
    }


    return await inscripcionDatosService
        .listarPorParticipante(
            baseDatos,
            participanteId
        );
}


/*
Obtiene los participantes inscritos
en una actividad.
*/
async function listarInscripcionesPorActividad(
    baseDatos,
    actividadId
){

    // Verifica que el identificador
    // de la actividad sea válido
    if(!validarId(actividadId)){

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
            actividadId
        );


    if(!actividad){

        const error =
            new Error(
                "No se encontró la actividad."
            );

        error.status = 404;

        throw error;
    }


    // Obtiene todas las inscripciones
    // relacionadas con la actividad
    const inscripciones =
        await inscripcionDatosService
            .listarPorActividad(
                baseDatos,
                actividadId
            );


    // Arreglo donde se guardarán
    // los participantes encontrados
    const participantes = [];


    // Recorre las inscripciones
    for(
        const inscripcion
        of inscripciones
    ){

        // Busca el participante relacionado
        // con cada inscripción
        const participante =
            await participanteDatosService.obtener(
                baseDatos,
                inscripcion.participanteId.toString()
            );


        // Verifica que el participante exista
        if(participante){

            participantes.push({

                _id:
                    participante._id,

                nombreCompleto:
                    participante.nombreCompleto,

                identificacion:
                    participante.identificacion,

                correoElectronico:
                    participante.correoElectronico,

                telefono:
                    participante.telefono,

                edad:
                    participante.edad,

                profesion:
                    participante.profesion,

                idInscripcion:
                    inscripcion._id
            });
        }
    }


    // Devuelve la actividad consultada
    // junto con sus participantes inscritos
    return {

        actividad: {

            _id:
                actividad._id,

            nombreActividad:
                actividad.nombreActividad,

            fecha:
                actividad.fecha,

            horaInicio:
                actividad.horaInicio,

            horaFin:
                actividad.horaFin
        },

        participantes:
            participantes
    };
}

/*
Elimina una inscripción y devuelve
el cupo a la actividad correspondiente.
*/
async function eliminarInscripcion(
    baseDatos,
    idInscripcion
){

    // Verifica que el identificador
    // tenga formato válido
    if(!validarId(idInscripcion)){

        const error =
            new Error(
                "El identificador de la inscripción no es válido."
            );

        error.status = 400;

        throw error;
    }


    // Busca la inscripción antes de eliminarla
    const inscripcion =
        await inscripcionDatosService.obtener(
            baseDatos,
            idInscripcion
        );


    // Verifica que exista
    if(!inscripcion){

        const error =
            new Error(
                "No se encontró la inscripción."
            );

        error.status = 404;

        throw error;
    }


    // Obtiene la actividad relacionada
    const actividadId =
        inscripcion.actividadId.toString();


    const actividad =
        await actividadDatosService.obtener(
            baseDatos,
            actividadId
        );


    // Elimina la inscripción
    const resultado =
        await inscripcionDatosService.eliminar(
            baseDatos,
            idInscripcion
        );


    // Si la actividad todavía existe,
    // devuelve el cupo
    if(actividad){

        const nuevoCupo =
            Number(actividad.cupo) + 1;

        await actividadDatosService.actualizarCupo(
            baseDatos,
            actividadId,
            nuevoCupo
        );
    }


    return resultado;
}

/*
Busca un participante por identificación
y devuelve todas sus inscripciones
con la información de las actividades.
*/
async function buscarInscripcionesPorIdentificacion(
    baseDatos,
    identificacion
){

    // Busca al participante por su número de identificación
    const participante =
        await participanteDatosService
            .obtenerPorIdentificacion(
                baseDatos,
                identificacion
            );


    // Verifica que el participante exista
    if(!participante){

        const error =
            new Error(
                "No se encontró un participante con esta identificación."
            );

        error.status = 404;

        throw error;
    }


    // Busca todas las inscripciones
    // relacionadas con el participante
    const inscripciones =
        await inscripcionDatosService
            .listarPorParticipante(
                baseDatos,
                participante._id.toString()
            );


    // Arreglo que contendrá las inscripciones
    // junto con los datos de cada actividad
    const inscripcionesCompletas = [];


    // Recorre las inscripciones encontradas
    for(
        const inscripcion
        of inscripciones
    ){

        // Busca la actividad relacionada
        const actividad =
            await actividadDatosService.obtener(
                baseDatos,
                inscripcion.actividadId.toString()
            );


        // Solo agrega la inscripción
        // si la actividad todavía existe
        if(actividad){

            inscripcionesCompletas.push({

                idInscripcion:
                    inscripcion._id,

                actividadId:
                    actividad._id,

                nombreActividad:
                    actividad.nombreActividad,

                eventoAsociado:
                    actividad.eventoAsociado,

                fecha:
                    actividad.fecha,

                horaInicio:
                    actividad.horaInicio,

                horaFin:
                    actividad.horaFin,

                ubicacion:
                    actividad.ubicacion,

                responsable:
                    actividad.responsable,

                estado:
                    inscripcion.estado
            });
        }
    }


    // Devuelve la información del participante
    // junto con todas sus inscripciones
    return {

        participante: {

            _id:
                participante._id,

            nombreCompleto:
                participante.nombreCompleto,

            identificacion:
                participante.identificacion,

            correoElectronico:
                participante.correoElectronico
        },

        inscripciones:
            inscripcionesCompletas
    };
}

// Exporta las funciones del servicio
module.exports = {
    registrarInscripcion,
    listarInscripcionesPorParticipante,
    listarInscripcionesPorActividad,
    eliminarInscripcion,
    buscarInscripcionesPorIdentificacion
};