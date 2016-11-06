function holaMundo(nombre) {
	return "Hola mundo soy: " + nombre; 
}

let nombre = "Jmocana";

document.getElementById('container').innerHTML = holaMundo(nombre);