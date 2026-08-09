// Funciones pequeñas que se repetían copiadas en varios archivos.
// Al estar aquí, se corrigen o se mejoran en un solo lugar.


// Quita las tildes de un texto, para que las búsquedas encuentren
// "Ramirez" aunque la persona esté guardada como "Ramírez".
export function quitarTildes(texto){

    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


// Convierte un texto en algo cómodo de comparar:
// sin tildes, sin espacios sobrantes y en minúscula.
export function normalizarTexto(texto){

    return quitarTildes(texto).trim().toLowerCase();
}


// Muestra una fecha guardada como "2026-09-15" en formato dd/mm/aaaa
export function darFormatoFecha(fecha){

    if(!fecha){
        return "";
    }

    const partes = String(fecha).substring(0, 10).split("-");

    if(partes.length !== 3){
        return fecha;
    }

    return partes[2] + "/" + partes[1] + "/" + partes[0];
}


// Muestra una hora de 24 horas ("14:30") en formato de 12 horas ("2:30 PM")
export function darFormatoHora(hora){

    if(!hora){
        return "";
    }

    const partes = String(hora).split(":");

    if(partes.length < 2){
        return hora;
    }

    let horas = Number(partes[0]);
    const minutos = partes[1];

    const periodo = horas >= 12 ? "PM" : "AM";

    horas = horas % 12;

    if(horas === 0){
        horas = 12;
    }

    return horas + ":" + minutos + " " + periodo;
}


// Une en un solo texto todos los valores de un registro que se quieren
// poder buscar. Se usa en los listados para filtrar mientras se escribe.
export function unirParaBuscar(valores){

    return normalizarTexto(valores.join(" "));
}
