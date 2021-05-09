let golpes = [];

class Golpe {
	constructor(alias, nome, energia, respeito, custo) {
		this.alias    = alias;
		this.nome     = nome;
		this.energia  = energia;
		this.respeito = respeito;
		this.custo    = custo;

		golpes = {...golpes, ...{[alias]: this}};
	}

	criarClicks() {
		let botao = sel(`#escola #escola_${this.alias}`)[0];
		
		botao.alias = this.alias;
		botao.addEventListener('click', () => {
			golpes[this.alias].aprender();
		});
	}

	aprender() {
		let info = sel(`#escola #escola_${this.alias}`)[0];

		if (info.classList.contains('inativo')) {
			return;
		} else {
			info.classList.add('aprendido');
			let botao = sel(`#escola #escola_${this.alias} .botao`)[0];
			botao.innerHTML = "Aprendido!";
		}
	}
}
new Golpe('airflare', 'Air Flare', 30, 45, {forca: 600, destreza: 400});
new Golpe('deadman', 'Deadman', 75, 120, {forca: 1200, charme: 300});
new Golpe('babyfreeza', 'Baby Freeza', 110, 180, {destreza: 6000, equilibrio: 200});
new Golpe('hellicopter', 'Hellicopter', 30, 80, {equilibrio: 200, charme: 6000});
new Golpe('thefrog', 'The Frog', 140, 400, {forca: 180, equilibrio: 3600});

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

let energiaTotal    = 200;
let energia         = 200;
let energiaGanho    = 100;
let contagem        = 3;
let respeitoVoce    = 0;
let respeitoInimigo = 0;
let timer;
let log = [];
let fase  = 0;
let turno = 0;

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

function gastaFolego(atividade) {
	if (folego) {
		if (atividade == 'forca') {
			if (forca <= forcaTotal) {
				forca += forcaIncremento;
				updateForca();
			} else {
				return false;
			}
		}
		if (atividade == 'destreza') {
			if (destreza <= destrezaTotal) {
				destreza += destrezaIncremento;
				updateDestreza();
			} else {
				return false;
			}
		}
		if (atividade == 'equilibrio') {
			if (equilibrio <= equilibrioTotal) {
				equilibrio += equilibrioIncremento;
				updateEquilibrio();
			} else {
				return false;
			}
		}
		if (atividade == 'charme') {
			if (charme <= charmeTotal) {
				charme += charmeIncremento;
				updateCharme();
			} else {
				return false;
			}
		}
		folego--;
		atualizaFolego();
	}
}