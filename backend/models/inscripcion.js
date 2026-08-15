/*
============================================================
MODELO DE INSCRIPCIÓN
============================================================

Define cómo luce una inscripción antes
de guardarse en MongoDB.
============================================================
*/

const { ObjectId } = require("mongodb");


/*
Crea una inscripción.
*/
function crearInscripcion(datos){

    return{

        participanteId:
            new ObjectId(
                datos.participanteId
            ),

        actividadId:
            new ObjectId(
                datos.actividadId
            ),

        fechaRegistro:
            new Date(),

        estado:
            "Activa"
    };
}


// Exporta la función
module.exports = {
    crearInscripcion
};