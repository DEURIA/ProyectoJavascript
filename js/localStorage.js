function verDisponibilidad(){
    if(typeof(Storage) !== "undefined") {
        console.log("LocalStorage disponible");
    } else {
        console.log("localStorage no disponible");

    }
}

//con este es para el primero aqui no se muestran los paises en la lista
// Función para obtener los países desde la API
async function obtenerPaises() {
    // Verificar si ya existen datos en localStorage
    let paisesGuardados = localStorage.getItem("paises");

    if (paisesGuardados) {
        console.log("Cargando países desde localStorage...");
        return JSON.parse(paisesGuardados);
    } else {
        console.log("Obteniendo países desde la API...");
        try {
            const response = await fetch("https://restcountries.com/v3.1/all");
            if (!response.ok) {
                throw new Error("Error al obtener los países");
            }
            const data = await response.json();

            // Guardar en localStorage para futuras cargas
            localStorage.setItem("paises", JSON.stringify(data));

            return data;
        } catch (error) {
            console.error("Error al obtener los países:", error);
            return [];
        }
    }
}



document.addEventListener("DOMContentLoaded", async () => {
    verDisponibilidad(); // Verifica si localStorage está disponible
    await obtenerPaises();//llamamos a la funcion para obtener los paises de la API

});