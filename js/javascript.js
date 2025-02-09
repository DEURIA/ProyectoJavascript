//declarar variables para el buscador
let inputBuscador =document.getElementById("inputBuscador");
let botonBuscador =document.getElementById("botonBuscador"); /*la lupita*/
let informacion=document.getElementById("informacion"); /*de la cajita donde aparecera la info del pais*/




//***********************************************PARA SUGERENCIAS***************************************//
// Definir las sugerencias iniciales
let sugerencias = [
    'Costa Rica', 'Spain', 'Germany', 'Japan', 'China', 'India', 'Honduras', 'Nicaragua', 'Italy', 'Germany', 'Mexico',
    'Peru', 'Cuba', 'France'
];

// Función para almacenar datos en localStorage
function almacenarDatos() {
    localStorage.setItem("sugerencias", JSON.stringify(sugerencias)); // Guardar el arreglo en localStorage
}

// Evento de búsqueda
//const inputBuscador = document.getElementById("inputBuscador");
const buscadorConTenedor = document.querySelector(".buscadorContenedor");
const contenedorSugerencias = document.querySelector(".contendorSugerencias");

inputBuscador.onkeyup = e => {//evento para cuando el usuario presione una tecla en el input de busqueda 
    let buscadorUsuario = e.target.value.trim();//obtener el valor ingresado por el usuario
    let arraybacio = [];//arreglo para llenar con los resultados del filtro de la busqueda

    if(buscadorUsuario) {
        // Filtra las sugerencias que coinciden con lo que el usuario escribe
        arraybacio = sugerencias.filter(search => {//filtro el arreglo de sugerencias con la coincidencia de letras
            return search.toLocaleLowerCase().startsWith(buscadorUsuario.toLocaleLowerCase());
        });

        // Si no se encuentran resultados, añadirlo a las recomendaciones
        if (arraybacio.length === 0 && !sugerencias.includes(buscadorUsuario)) {
            sugerencias.push(buscadorUsuario); // Añadir a la lista de sugerencias
            almacenarDatos(); // Guardar el arreglo actualizado
            arraybacio = [buscadorUsuario]; // Mostrar el país nuevo como sugerencia
        }

        // Crear las listas de sugerencias en formato HTML
        arraybacio = arraybacio.map(search => {
            return `<li>${search}</li>`;
        });

        // Activa la clase para mostrar las sugerencias
        buscadorConTenedor.classList.add('active');//activa la clase para mostrar sugerencias 
        mostrarSugerencias(arraybacio);//llama a la funcion para mostrar las sugerencias

        let todasLasListas = contenedorSugerencias.querySelectorAll('li');
        todasLasListas.forEach(li => {//para cada li en la lista de sugerencias se le agrega un evento onclick para seleccionar la sugerencia 
            li.setAttribute('onclick', 'select(this)');//se le agrega el evento onclick para seleccionar la sugerencia
        });
    } else {
        contenedorSugerencias.classList.remove('active');//si no hay resultados se remueve la clase active para ocultar las sugerencias
        contenedorSugerencias.innerHTML = '';
    }
};

// Función para seleccionar una sugerencia
function select(elemento) {
    let UsarBuscador = elemento.textContent;
    inputBuscador.value = UsarBuscador;
    contenedorSugerencias.classList.remove('active');
    contenedorSugerencias.innerHTML = '';
};

// Función para mostrar las sugerencias
const mostrarSugerencias = list => {
    let buscadorLista;

    if (!list.length) {
        valorUsuario = inputBuscador.value;
        buscadorLista = `<li>${valorUsuario}</li>`;
    } else {
        buscadorLista = list.join('');
    }

    contenedorSugerencias.innerHTML = buscadorLista;
};








/******************************************************************************************************* */
//************************ PARA EL BUSCADOR CON API con localstorage *********************************** */
// Evento
botonBuscador.addEventListener("click", async () => {//evento para cuando el usuario presione el boton de busqueda 
    let NombrePais = inputBuscador.value.trim(); // Obtener valor ingresado por el usuario

    if (NombrePais === "") {
        informacion.innerHTML = `<h3> El input de entrada no es válido</h3>`;
        return;
    }

    // Normalizar el nombre del país (mayúsculas y minúsculas no afectan)
    let NombrePaisNormalizado = NombrePais.toLowerCase();

    // Buscar en localStorage
    let paisesGuardados = JSON.parse(localStorage.getItem("paises")) || []; // Obtener los países guardados en localStorage 
    let paisEncontrado = paisesGuardados.find(pais => // Buscar el país en el arreglo de países guardados en localStorage 
        pais.name.common.toLowerCase() === NombrePaisNormalizado
    );

    if (paisEncontrado) {
        console.log("Cargando desde localStorage:", paisEncontrado);
        mostrarInformacionPais(paisEncontrado);
        return; // Evita llamar a la API si ya tenemos los datos
    }

    // Si no está en localStorage, buscar en la API
    let finalUrl = `https://restcountries.com/v3.1/name/${NombrePais}?fullText=true`;
    console.log(finalUrl);

    try {
        const response = await fetch(finalUrl);//para obtener la respuesta de la API 
        if (!response.ok) {//si no se obtiene una respuesta correcta
            throw new Error("Lo sentimos, el país no fue encontrado en la API.");//para mostrar el error en la pagina web
        }
        const data = await response.json();//para convertir la respuesta en formato json

        // Guardar el país en localStorage para futuras búsquedas
        paisesGuardados.push(data[0]);
        localStorage.setItem("paises", JSON.stringify(paisesGuardados));

        console.log("Guardado en localStorage:", data[0]);//para ver en consola lo q se guardo en localstorage
        mostrarInformacionPais(data[0]);//para mostrar la info del pais en la pagina web 

    } catch (error) {
        informacion.innerHTML = `<h3> ${error.message}</h3>`;//para mostrar el error en la pagina web 
    }
});

//************************ FUNCION PARA MOSTRAR INFORMACION DEL PAÍS ****************************** */
function mostrarInformacionPais(pais) {
    informacion.innerHTML = 
        `<img src="${pais.flags.svg}" class="imgbanderas"> 

        <h2>${pais.name.common} </h2>

        <div class="informacionContenedor">
            <div class="informacionContenedorData">   
                <h4>Capital:</h4>
                <span>${pais.capital ? pais.capital[0] : "N/A"}</span>
            </div>
        </div>
        
        <div class="informacionContenedor">
            <div class="informacionContenedorData">   
                <h4>Población:</h4>
                <span>${pais.population.toLocaleString()}</span>
            </div>
        </div>`;
}
//****************************************************************** */

















//***********************************************PARA SUGERENCIAS sin el localstora***************************************//
//const buscadorConTenedor = document.querySelector(".buscadorContenedor");
//const inputSearch = buscadorConTenedor.querySelector("input");
//const contenedorSugerencias = document.querySelector(".contendorSugerencias");

/*esto es para el filtro para la primer letra q el usuario digite muestra las sugerencia que tengo en sugerencias.js
/*para lo de sugerencias va guardando lo que el usuario digita*/
/*inputBuscador.onkeyup= e => {//el okeyup es un evento q se va activar cada vez que el usaurio presione y suelte una tecla en el input
    let buscadorUsuario = e.target.value;//lo q escribe el usuario
    let arraybacio = [];//con este arreglo se va llenar con los resultados del filtro de la busqueda

    if(buscadorUsuario){//con esto filtro solo si el usuario ha ingresado algo, no es null
        arraybacio =sugerencias.filter(search => {//aqui filtro el arreglo q hice en el otro jv con la cocincidencia de letras
            return search.toLocaleLowerCase().startsWith(buscadorUsuario.toLocaleLowerCase());
        });
        arraybacio = arraybacio.map(search => {
            return search = `<li>${search}</li>`//aca lo que hago es q con map recorri el arreglo y luego voy a crear las li q se muestran
        });    

        //activa la clase para mostrar sugerencia
        buscadorConTenedor.classList.add('active');
        mostrarSugerencias(arraybacio);//llamo a lo que hice abajo para mostrar la sugerencia

        let todasLasListas=contenedorSugerencias.querySelectorAll('li');

        todasLasListas.forEach(li => {
            li.setAttribute('onclick','select(this)')
            
        });
    }else{
        contenedorSugerencias.classList.remove('active');
        contenedorSugerencias.innerHTML = '';
    }
};

//funcion para que me complete la barra del input con lo de la sugerencia, del codigo de arriba y abajo
function select(elemento){
    let UsarBuscador = elemento.textContent;
    inputBuscador.value = UsarBuscador;
    contenedorSugerencias.classList.remove('active'); // Oculta las sugerencias después de seleccionar
    contenedorSugerencias.innerHTML = ''; // Limpia las sugerencias seleccionadas
};

//para mostar
const mostrarSugerencias= list => {
    let buscadorLista;

    if (!list.length) {//si no hay resultados
        valorUsuario = inputBuscador.value;//tomara el valor del input osea la barrita 
        buscadorLista=`<li>${valorUsuario}</li>`//muestra como sugrencias
    } else {
        buscadorLista = list.join('');//usa las sugerencias en un string
    }
    contenedorSugerencias.innerHTML = buscadorLista;//para insertar el html en el contendor de sugerencias
};*/

















//************************PARA EL BUSCADOR CON API directamente sin el localstorage****************************** */
//evento
/*
botonBuscador.addEventListener("click", () => {
   
    let NombrePais= inputBuscador.value.trim();//obtener valor ingresado x el usuario

    if (NombrePais === "") {
        informacion.innerHTML = `<h3> El input de entrada no es válido</h3>`;
        return;
    }

    let finalUrl= `https://restcountries.com/v3.1/name/${NombrePais}?fullText=true`//aca se va insertar el link de la API
    console.log(finalUrl);

    fetch(finalUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Lo sentimos, El país no fue encontrado en la API.");
            }
            return response.json();
        })//despues de recibir respuesta del apo se convierta la resp en formato json
        .then(data => {
        console.log(data[0]); // Ver los datos en la consola

            //todo esto esta dentro del contenedor del html que se llama contenedorPrincipal, lo colocare aqui en js cada apartado y este se añadira en informacion
            informacion.innerHTML = 
            `<img src="${data[0].flags.svg}" class="imgbanderas"> 
            <h2>${(data[0].name.common)} </h2>
            <div class="informacionContenedor">
                <div class="informacionContenedorData">   
                    <h4>
                        Capital:
                    </h4>
                    <span>
                        ${data[0].capital[0]}
                    </span>
                </div>
            </div>
            
          <div class="informacionContenedor">
                <div class="informacionContenedorData">   
                    <h4>
                        Poblacion:
                    </h4>
                    <span>
                        ${data[0].population}
                    </span>
                </div>
            </div>
            `;
        })
        /*para se inserte solo informacion valida*/
       /* .catch(error => {
            informacion.innerHTML = `<h3> ${error.message}</h3>`;
        });

});*/


  //*lo que quiero consultar en la api y mopstrar x consola, esta informacion la extraigo para tener solo de referencia*/
  // console.log(data[0]);
  // console.log(data[0].capital[0]);//
   //console.log(data[0].flags.svg);
  // console.log(data[0].name.common);
  // console.log(data[0].continents[0]);
  // console.log(Object.keys(data[0].currencies)[0]);
  // console.log(data[0].currencies[Object.keys(data[0].currencies)].name);
  // console.log(Object.values(data[0].languages).toString().split(",").join(", "));
  // console.log(data[0].population);//

 