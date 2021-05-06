let atividades = [];

class Atividade {
	constructor(alias, nome) {
		this.alias      = alias;
		this.nome       = nome;
		this.valor      = 0;
		this.limite     = 10000;
		this.incremento = 0;

		atividades = {...atividades, ...{[alias]: this}};
	}

	adicionar() {
		if (!gastarFolego()) return;

		this.incremento += 10;
		this.atualizarHtml();
	}

	remover() {
		if (!this.incremento) return false;
		if (!adicionarFolego()) return false;

		this.incremento -= 10;
		this.atualizarHtml();
	}

	atualizarTotal() {
		if (this.valor == this.limite) return false;

		let tempIncremento;

		if (this.valor + this.incremento > this.limite) {
			tempIncremento = this.limite - this.valor;
		} else {
			tempIncremento = this.incremento;
		}
		
		this.valor += tempIncremento;
		this.atualizarHtml();
	}

	atualizarHtml() {
		sel(`#atividades #${this.alias} .total`)[0].innerHTML = this.valor;
		sel(`#atividades #${this.alias} .incremento`)[0].innerHTML = `(+${this.incremento}/s)`;
		sel(`#atividades #${this.alias} .preenchimento`)[0].style.width = retornarPorcentagem(this.valor, this.limite) +"%";
	}

	gerarHtml() {
		const html = `
			<div id="${this.alias}">
				<div class="valores">
					${this.nome}:
					<span class="total">${this.valor}</span>
					<span class="incremento">(+${this.incremento}/s)</span>
				</div>
				<div class="capacidade">
					<div class="preenchimento"></div>
				</div>
				<div class="botao menos">-</div>
				<div class="botao mais">+</div>
			</div>`
		
		return html;
	}

	criarClicks() {
		sel(`#atividades #${this.alias} .mais`)[0].alias = this.alias;
		sel(`#atividades #${this.alias} .menos`)[0].alias = this.alias;

		sel(`#atividades #${this.alias} .mais`)[0].addEventListener('click', () => {
			atividades[this.alias].adicionar();
		});
		sel(`#atividades #${this.alias} .menos`)[0].addEventListener('click', () => {
			atividades[this.alias].remover();
		});
	}
}
new Atividade('forca', 'Força');
new Atividade('destreza', 'Destreza');
new Atividade('equilibrio', 'Equilíbrio');
new Atividade('charme', 'Charme');

function montaCenaAcademia() {
	clearInterval(timer);
	timer = null;

	let cena = sel('#cena')[0];
	cena.innerHTML = "";
	cena.classList.remove(...cena.classList);
	cena.classList.add('academia');

	let folegoHtml = `
		<div id="folego">
			<div id="indicador">
				Folego: <span id="folegoInfo">${folego}</span><br><br>
				<div id="marcador">
					<div class="preenchimento"></div>
				</div>
			</div>
			<div class="botao" id="botaoFolego">+1</div>
		</div>`;
	cena.insertAdjacentHTML('beforeend', folegoHtml);
	atualizarFolego();

	let atividadesHtml = `<div id="atividades">`;
	for (atividade in atividades) {
		atividadesHtml += atividades[atividade].gerarHtml();
	};
	atividadesHtml += `</div>`
	cena.insertAdjacentHTML('beforeend', atividadesHtml);

	for (atividade in atividades) {
		atividades[atividade].criarClicks();
		atividades[atividade].atualizarHtml();
	};

	sel('#botaoFolego')[0].addEventListener('click', adicionarFolego);

	let escolaHtml = `
		<div id="escola">
			<div class="aprender_golpe">
				<div class="info"><span>Air Flare</span><br>30f / 20r</div>
				<div class="botao">2k F</div>
			</div>
			<div class="aprender_golpe">
				<div class="info"><span>Hellicopter</span><br>30f / 20r</div>
				<div class="botao">3k C + 750 D</div>
			</div>
			<div class="aprender_golpe">
				<div class="info"><span>Hellicopter</span><br>30f / 20r</div>
				<div class="botao">3k C + 750 D</div>
			</div>
			<div class="aprender_golpe">
				<div class="info"><span>Hellicopter</span><br>30f / 20r</div>
				<div class="botao">3k C + 750 D</div>
			</div>
			<div class="aprender_golpe">
				<div class="info"><span>Hellicopter</span><br>30f / 20r</div>
				<div class="botao">3k C + 750 D</div>
			</div>
			<div class="aprender_golpe">
				<div class="info"><span>Hellicopter</span><br>30f / 20r</div>
				<div class="botao">3k C + 750 D</div>
			</div>
			<div class="aprender_golpe">
				<div class="info"><span>Hellicopter</span><br>30f / 20r</div>
				<div class="botao">3k C + 750 D</div>
			</div>
			<div class="aprender_golpe">
				<div class="info"><span>Hellicopter</span><br>30f / 20r</div>
				<div class="botao">3k C + 750 D</div>
			</div>
			<div class="aprender_golpe">
				<div class="info"><span>Hellicopter</span><br>30f / 20r</div>
				<div class="botao">3k C + 750 D</div>
			</div>
			<div class="aprender_golpe">
				<div class="info"><span>Hellicopter</span><br>30f / 20r</div>
				<div class="botao">3k C + 750 D</div>
			</div>
		</div>`;
	cena.insertAdjacentHTML('beforeend', escolaHtml);
}

function updateValores() {
	for (atividade in atividades) {
		atividades[atividade].atualizarTotal();
	};
}

function adicionarFolego() {
	if (folego == folegoCapacidade) return false;

	folego++;
	atualizarFolego();

	return true;
}

function gastarFolego() {
	if (!folego) return false;
	
	folego--;
	atualizarFolego();

	return true;
}

function atualizarFolego() {
	sel('#folegoInfo')[0].innerHTML = folego;
	sel('#folego .preenchimento')[0].style.width = retornarPorcentagem(folego, folegoCapacidade) + "%";
}

let folego           = 0;
let folegoCapacidade = 30;

let frame = setInterval(updateValores, 1000);