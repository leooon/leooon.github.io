let golpes = [];

class Golpe {
	constructor(nome, energia, respeito) {
		this.nome     = nome;
		this.energia  = energia;
		this.respeito = respeito;

		golpes.push(this);
	}

	greet() {
		return `${this.name} says hello.`;
	}
}
new Golpe('Air Flare', 30, 45);
new Golpe('Deadman', 75, 120);
new Golpe('Baby Freeza', 110, 180);
new Golpe('Hellicopter', 30, 80);
new Golpe('The Frog', 140, 400);

function sel(t) {
	return document.querySelectorAll(t);
}
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function montarMenuGolpes() {
	const menu = sel('#menuGolpes')[0];

	golpes.forEach((golpe) => {
		let botao = `
		<div class="botao" data-energia="${golpe.energia}" data-respeito="${golpe.respeito}" data-nome="${golpe.nome}">
			<div class="nome">${golpe.nome}</div>
			<div class="energia-valor">${golpe.energia}e</div>
			<div class="respeito-valor">${golpe.respeito}r</div>
		</div>
		`;
		
		menu.insertAdjacentHTML('afterbegin', botao);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	ativaMenu();
	montarMenuGolpes();
	timer = setInterval(iniciarTurno, 1000);
});

let energiaTotal    = 200;
let energia         = 200;
let energiaGanho    = 100;
let contagem        = 3;
let respeitoVoce    = 0;
let respeitoInimigo = 0;

function escolheGolpes() {
	let contagemAtual = contagem;

	let golpes = sel('#menuGolpes .botao');
	golpes = [].slice.call(golpes);

	while (contagemAtual) {
		escolhido = rand(1, golpes.length) - 1;

		if (energia > golpes[escolhido].dataset.energia) {
			energia -= golpes[escolhido].dataset.energia;
			golpes[escolhido].classList.add('ativo');

			criaLog('Usou '+ golpes[escolhido].dataset.nome +'. -'+ golpes[escolhido].dataset.energia +' energia.<br>');
			respeitoVoce += parseInt(golpes[escolhido].dataset.respeito);
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
	atualizaRespeito();

	turno++;
	let infoTurno = sel('#turno')[0];
	infoTurno.innerHTML = turno;

	if (turno == 5) clearInterval(timer);
}

function resetBotoes() {
	let golpes = sel('#menuGolpes .botao');
	golpes.forEach(function(el) {
		el.classList.remove('ativo', 'proibido');
	});
}
function atualizaEnergia() {
	porcentagem = energia / 2;
	sel('#preenchimento')[0].style.width = porcentagem +'%';
}
function atualizaRespeito() {
	sel('#voce-respeito')[0].innerHTML = respeitoVoce;
}
function criaLog(texto) {
	let log = sel('#log')[0];
	log.insertAdjacentHTML('afterbegin', texto);
}

function ativaMenu() {
	let botoesMenu = sel('#menu div');

	botoesMenu.forEach(el => el.addEventListener('click', () => {
		let ativo = sel('#menu div.ativo')[0];
		ativo.classList.remove('ativo');

		el.classList.add('ativo');
	}));
}