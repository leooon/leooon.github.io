let versao = 0.2;

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

function corrigeAltura() {
	sel('#container')[0].style.height = window.innerHeight +'px';
}
document.addEventListener('DOMContentLoaded', () => {
	corrigeAltura();
	ativaMenu();
	montaCenaAcademia();
});
window.addEventListener('resize', corrigeAltura);

let energiaTotal    = 200;
let energia         = 200;
let energiaGanho    = 100;
let contagem        = 3;
let respeitoVoce    = 0;
let respeitoInimigo = 0;
let timer;
let log = [];

let folego           = 0;
let folegoCapacidade = 30;

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
	if (turno >= 5) {
		timer = null;
		clearInterval(timer);

		return;
	}

	if (fase == 1) {
		resetBotoes();

		energia += energiaGanho;
		criaLog('--> Recarregou '+ energiaGanho +' energia.<br>');

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
	log.push(texto);

	exibeLog();
}
function exibeLog() {
	let logArea = sel('#log')[0];
	logArea.innerHTML = '';

	log.forEach(texto => {
		logArea.insertAdjacentHTML('afterbegin', texto);
	})
}

function ativaMenu() {
	let botoesMenu = sel('#menu div');

	botoesMenu.forEach(el => el.addEventListener('click', () => {
		let ativo = sel('#menu div.ativo')[0];
		ativo.classList.remove('ativo');
		el.classList.add('ativo');

		if (el.classList.contains('batalha')) {
			montaCenaBatalha();
		} else if (el.classList.contains('academia')) {
			montaCenaAcademia();
		}
	}));
}

function montaCenaBatalha() {
	let cena = sel('#cena')[0];
	cena.classList.remove(...cena.classList);
	cena.classList.add('batalha');

	cena.innerHTML = `
		<div id="arena">
			Versão: ${versao}<br>
			Turno: <span id="turno">${turno}</span><br>
			Você: <span id="voce-respeito">${respeitoVoce}</span><br>
			Inimigo: <span id="inimigo-respeito">${respeitoInimigo}</span><br><br>
			<div id="log"></div>
		</div>
		<div id="energia">
			<div id="marcador">
				<div id="preenchimento"></div>
			</div>
		</div>
		<div id="menuGolpes"></div>
	`;

	exibeLog();
	montarMenuGolpes();
	atualizaEnergia();

	if (!timer)	timer = setInterval(iniciarTurno, 1000);
}
function montaCenaAcademia() {
	clearInterval(timer);
	timer = null;

	let cena = sel('#cena')[0];
	cena.classList.remove(...cena.classList);
	cena.classList.add('academia');

	cena.innerHTML = `
		<div id="folego">
			<div id="indicador">
				Folego: <span id="folegoInfo">${folego}</span><br><br>
				<div id="marcador">
					<div class="preenchimento"></div>
				</div>
			</div>
			<div class="botao" id="botaoFolego">+1</div>
		</div>
		<div id="atividades">
			<div>
				<div class="valores">Força: <span id="forcaValores">1k (+10/s)</div>
				<div class="capacidade">
					<div class="preenchimento"></div>
				</div>
				<div class="botao">-</div>
				<div class="botao">+</div>
			</div>
			<div>
				<div class="valores">Destreza: <span id="forcaValores">1k (+10/s)</div>
				<div class="capacidade">
					<div class="preenchimento"></div>
				</div>
				<div class="botao">-</div>
				<div class="botao">+</div>
			</div>
			<div>
				<div class="valores">Equilíbrio: <span id="forcaValores">1k (+10/s)</div>
				<div class="capacidade">
					<div class="preenchimento"></div>
				</div>
				<div class="botao">-</div>
				<div class="botao">+</div>
			</div>
			<div>
				<div class="valores">Charme: <span id="forcaValores">1k (+10/s)</div>
				<div class="capacidade">
					<div class="preenchimento"></div>
				</div>
				<div class="botao">-</div>
				<div class="botao">+</div>
			</div>
		</div>
	`;

	sel('#botaoFolego')[0].addEventListener('click', adicionarFolego);
}

function adicionarFolego() {
	if (folego == folegoCapacidade) return false;

	folego++;

	sel('#folegoInfo')[0].innerHTML = folego;
	sel('#folego .preenchimento')[0].style.width = retornarPorcentagem(folego, folegoCapacidade) + "%";
}

function retornarPorcentagem(atual, total) {
	return Math.ceil((atual / total) * 100);
}