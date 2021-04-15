function l(t) {
	console.log(t);
};
function sel(t) {
	return document.querySelectorAll(t);
}
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('DOMContentLoaded', () => {
	iniciaBatalha();
});

let energiaTotal = 200;
let energia      = 200;
let contagem     = 3;

function iniciaBatalha () {
	

	escolheGolpes();
}

function escolheGolpes() {
	let golpes = sel('#menu .botao');
	golpes = [].slice.call(golpes);

	while (contagem) {
		escolhido = rand(1, golpes.length) - 1;

		if (energia > golpes[escolhido].dataset.energia) {
			energia -= golpes[escolhido].dataset.energia;
			golpes[escolhido].classList.add('ativo');
		} else {
			golpes[escolhido].classList.add('proibido');
		}
		
		golpes.splice(escolhido, 1);
		contagem--;
	}

	energia = energia / 2;
	sel('#preenchimento')[0].style.width = energia +'%';
}