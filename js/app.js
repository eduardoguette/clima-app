const container = document.querySelector('.wrapper');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
	formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
	e.preventDefault();

	// validar formulario
	const ciudad = document.querySelector('#ciudad').value;

	if (ciudad === '') {
		mostrarMensaje('Todos los campos son obligatorios');
	}

	// consultar la API

	consultarApi(ciudad);
}

function consultarApi(ciudad) {
	const apiId = 'ae0065c4e280acf8ad603fc4bf2e1157';
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiId}`;
	Spinner(); // muestra un spinner de cargar
	setTimeout(() => {
		fetch(url)
			.then((resp) => resp.json())
			.then((json) => {
				console.log(json);
				limpiarHTML(); // Limpiar HTML previo
				if (json.cod === '404') {
					mostrarMensaje('Ciudad no encontrada');
					resultado.classList.remove('dia');
					resultado.classList.remove('noche');
					resultado.classList.add('error');
					return;
				}
				// imprime la respuesta en el HTML
				mostrarClima(json);
			});
	}, 1000);
}
function mostrarClima(datos) {
	const {
		name,
		main: { temp_max, temp, temp_min },
		sys: { country },
		weather: [{ id, icon, description, main }],
	} = datos;

	const centigrados = kelvinACentrigrados(temp);
	const max = kelvinACentrigrados(temp_max);
	const min = kelvinACentrigrados(temp_min);

	const divResultado = document.createElement('div');

	if (icon.includes('n')) {
		resultado.classList.remove('dia');

		resultado.classList.remove('error');
		resultado.classList.add('noche');
	} else {
		resultado.classList.remove('error');
		resultado.classList.remove('noche');
		resultado.classList.add('dia');
	}
	divResultado.classList.add('p-4', 'mx-auto', 'w-6/6', 'wrapper-result');
	divResultado.innerHTML = ` 
	<h1 class="text-3xl font-bold ml-1">${name}, ${country}</h1>

<div class="flex items-center	justify-between mt-1">
	<div class="wrapper-max-min my-2">
		<p class="ml-1"> Day ${max}&#186;&#x2191; &#x2022;	Night ${min}&#186;&#x2193; </p>
		<h1 class="text-8xl font-normal">${centigrados}<span class="text-2xl relative left-2 -top-12 mb-5">&#186;C</span></h1>
	</div>
	<div class="flex items-center flex-col">
		<img src="./images/${icon}@2x.png" height="40" alt="${description}">
		<p>${main}</p>
	</div>
</div>

<div>
	
	
		
</div>


`;
	resultado.appendChild(divResultado);
}

const kelvinACentrigrados = (grados) => Math.ceil(grados - 273.15);

function limpiarHTML() {
	resultado.classList.remove('dia');
	resultado.classList.remove('noche');
	resultado.classList.remove('error');

	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}
}
function mostrarMensaje(mensaje) {
	const alerta = document.querySelector('.bg-red-100');
	if (!alerta) {
		const divAlert = document.createElement('div');
		divAlert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
		divAlert.innerHTML = `
	<strong class="font-bold">Error! </strong>
	<p>${mensaje}</p>
	`;
		container.appendChild(divAlert);

		setTimeout(() => {
			divAlert.remove();
		}, 3000);
	}
}

function Spinner() {
	limpiarHTML();
	const divSpinner = document.createElement('div');
	divSpinner.classList.add('sk-chase');
	divSpinner.innerHTML = `
<div class="sk-chase-dot"></div>
<div class="sk-chase-dot"></div>
<div class="sk-chase-dot"></div>
<div class="sk-chase-dot"></div>
<div class="sk-chase-dot"></div>
<div class="sk-chase-dot"></div>
`;
	resultado.appendChild(divSpinner);
}
