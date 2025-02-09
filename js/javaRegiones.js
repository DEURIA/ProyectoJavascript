
// Función para obtener países por región usando la API 
async function filterPorRegion() {
    const region = document.getElementById('regionSelect').value;
    
    if (!region) {
        return; // Si no se selecciona una región, no hacemos nada
    }

    // Limpiar los detalles del país al cambiar de región
    document.getElementById('nombrePais').textContent = '';
    document.getElementById('paisCapital').textContent = '';
    document.getElementById('papisPoblacion').textContent = '';
    document.getElementById('banderaPais').style.display = 'none'; // Ocultar 

    let paisesGuardados = JSON.parse(localStorage.getItem('paisesGuardados')); // Obtener los países guardados en localStorage
    if (paisesGuardados && Array.isArray(paisesGuardados)) { // Si hay países guardados se ejecuta
        const paisesFiltrados = paisesGuardados.filter(pais => pais.region === region); // Se filtran los países por región
        if (paisesFiltrados.length > 0) { // Si hay países en la región se ejecuta
            mostrarPaises(paisesFiltrados); // Se llama a la función pasando los países filtrados
            return; // Se sale de la función
        }
    }

    // Si no hay países guardados en localStorage o no hay países en la región seleccionada, se ejecuta lo siguiente
    let finalUrl = `https://restcountries.com/v3.1/region/${region}`; // URL para obtener los países por región
    console.log(finalUrl);
    try {
        const response = await fetch(finalUrl);
        const data = await response.json();
        console.log(data);
        mostrarPaises(data);

        // Mover los detalles del país al final del contenedor
        const contenedor = document.querySelector('.contenedor');
        const paisDetalles = document.getElementById('paisDetalles');
        contenedor.appendChild(paisDetalles); // Agrega a paisDetalles como último hijo de contenedor

        // Asegurar que la lista de países quede debajo del select
        const select = document.getElementById('regionSelect');
        contenedor.insertBefore(document.getElementById('listaPaises'), select.nextSibling); // Inserta la lista de países después del select
    } catch (error) {
        console.error('Error al obtener los países:', error); // Si ocurre un error se muestra  
    }
}

// Función para mostrar la lista de países
function mostrarPaises(paises) {
    const list = document.getElementById('listaPaises');
    list.innerHTML = ''; // Limpiar la lista de países antes de mostrar la nueva

    paises.forEach(country => {// Recorrer los países y mostrar el nombre de cada uno en un div con clase itemPais 
        const paisDiv = document.createElement('div'); // Crear un div
        paisDiv.textContent = country.name.common;
        paisDiv.classList.add('itemPais'); // Agregar clase itemPais al div creado 

        paisDiv.addEventListener('click', () => mostrarDetallesPais(country)); // Agregar evento al hacer clic
        list.appendChild(paisDiv); // Agregar a la lista de países el div creado con el nombre del país
    });
}

// Función para mostrar los detalles de un país cuando se hace clic en su nombre
function mostrarDetallesPais(country) {
    document.getElementById('nombrePais').textContent = `Nombre: ${country.name.common}`;
    document.getElementById('paisCapital').textContent = `Capital: ${country.capital ? country.capital[0] : 'No disponible'}`; // Si no hay capital se muestra "No disponible"
    document.getElementById('papisPoblacion').textContent = `Población: ${country.population}`;
    document.getElementById('banderaPais').src = country.flags.png;

    // Verificación de la URL de la bandera
    const banderaUrl = country.flags.png; // Obtener URL de la bandera
    console.log('URL de la bandera:', banderaUrl); // Depuración: ver la URL de la bandera

    if (banderaUrl) { // Si existe, se ejecuta y muestra bandera
        document.getElementById('banderaPais').src = banderaUrl; // Aquí se muestra la bandera en la img 
        document.getElementById('banderaPais').style.display = 'block'; // Mostrar la bandera
    } else { // Si no contiene un URL válido, se pasa aquí para que se oculte la imagen
        document.getElementById('banderaPais').style.display = 'none'; // Ocultar si no hay bandera
    }

    // Mover el div de detalles arriba
    const contenedor = document.querySelector('.contenedor'); // Selecciona el contenedor principal
    const detalles = document.getElementById('paisDetalles'); // Selecciona el div de detalles del país
    contenedor.prepend(detalles); // Mueve los detalles al inicio del contenedor
}

// Agregar el listener para el select
document.getElementById('regionSelect').addEventListener('change', filterPorRegion);
