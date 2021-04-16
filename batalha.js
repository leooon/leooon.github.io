function sel(t) {
	return document.querySelectorAll(t);
}
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let timer;

document.addEventListener('DOMContentLoaded', () => {
	timer = setInterval(iniciarTurno, 1000);
});

let energiaTotal = 200;
let energia      = 200;
let energiaGanho = 100;
let contagem     = 3;

function escolheGolpes() {
	let contagemAtual = contagem;

	let golpes = sel('#menu .botao');
	golpes = [].slice.call(golpes);

	while (contagemAtual) {
		escolhido = rand(1, golpes.length) - 1;

		if (energia > golpes[escolhido].dataset.energia) {
			energia -= golpes[escolhido].dataset.energia;
			golpes[escolhido].classList.add('ativo');

			criaLog('Usou '+ golpes[escolhido].dataset.nome +'. -'+ golpes[escolhido].dataset.energia +' energia.<br>');
		} else {
			golpes[escolhido].classList.add('proibido');

			criaLog('Tentou usar '+ golpes[escolhido].dataset.nome +'. Sem energia suficiente, fim da sequencia.<br>');

			break;
		}
		
		golpes.splice(escolhido, 1);
		contagemAtual--;
	}
}

let turno = 0;
let fase  = 0;
function iniciarTurno() {
	if (fase == 1) {
		resetBotoes();

		energia += energiaGanho;
		criaLog('<br>Recarregou '+ energiaGanho +' energia.<br><br>');

		atualizaEnergia();

		fase = 0;
		return;
	}
	fase = 1;

	escolheGolpes();
	atualizaEnergia();

	console.log("Turno: "+ turno);
	console.log("Energia: "+ energia);
	console.log("-----");
	turno++;

	if (turno == 5) clearInterval(timer);
}

function resetBotoes() {
	let golpes = sel('#menu .botao');
	golpes.forEach(function(el) {
		el.classList.remove('ativo', 'proibido');
	});
}
function atualizaEnergia() {
	porcentagem = energia / 2;
	sel('#preenchimento')[0].style.width = porcentagem +'%';
}
function criaLog(texto) {
	let log = sel('#log')[0];
	log.insertAdjacentHTML('afterbegin', texto);
}