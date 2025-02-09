function verDisponibilidad() {
    if (typeof(Storage) !== "undefined") {
        console.log("LocalStorage disponible");
    } else {
        console.log("localStorage no disponible");
    }
}

async function obtenerPaises() {
    let paisesGuardados = JSON.parse(localStorage.getItem('paisesGuardados')); // Obtener los países guardados en localStorage
    if (paisesGuardados && Array.isArray(paisesGuardados)) { // Verificar si hay países guardados y son un array
        mostrarPaises(paisesGuardados); // Se llama a la función pasando los países guardados
        return; // Se sale de la función
    }

    // Si no hay países guardados en localStorage, buscar en la API
    let finalUrl = `https://restcountries.com/v3.1/all`; // Se obtienen todos los países
    console.log(finalUrl); // Se muestra en consola
    try {
        const response = await fetch(finalUrl); // Se hace la petición a la API
        const data = await response.json(); // Se obtiene la respuesta en formato JSON
        console.log(data); // Se muestra en consola
        mostrarPaises(data); // Se llama a la función pasando los países obtenidos de la API

        // Almacenar los países obtenidos en localStorage
        localStorage.setItem('paisesGuardados', JSON.stringify(data));
    } catch (error) {
        console.error('Error al obtener los países:', error); // Si ocurre un error se muestra  
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    verDisponibilidad(); // Verifica si localStorage está disponible
    await obtenerPaises(); // Llamamos a la función para obtener los países de la API
});
