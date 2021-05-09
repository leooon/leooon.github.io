let atividades = [];

class Atividade {
	constructor(alias, letra, nome) {
		this.alias      = alias;
		this.nome       = nome;
		this.valor      = 0;
		this.limite     = 10000;
		this.incremento = 0;
		this.letra      = letra;

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
new Atividade('forca', 'f', 'Força');
new Atividade('destreza', 'd', 'Destreza');
new Atividade('equilibrio', 'e', 'Equilíbrio');
new Atividade('charme', 'c', 'Charme');

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

	let escolaHtml = `<div id="escola">`;
	let custoHtml;
	for ([key, golpe] of Object.entries(golpes)) {
		custoHtml = [];
		for ([key, value] of Object.entries(golpe.custo)) {
			custoHtml.push(`${value}${atividades[key].letra}`);
		};
		custoHtml = custoHtml.join(' + ');

		escolaHtml += `
			<div class="aprender_golpe inativo" id="escola_${golpe.alias}">
				<div class="info"><span>${golpe.nome}</span><br>${golpe.energia}e / ${golpe.respeito}r</div>
				<div class="botao">${custoHtml}</div>
			</div>`
	};
	escolaHtml += `</div>`
	cena.insertAdjacentHTML('beforeend', escolaHtml);

	for (golpe in golpes) {
		golpes[golpe].criarClicks();
	};


}

function updateValores() {
	for (atividade in atividades) {
		atividades[atividade].atualizarTotal();
	};

	atualizarEscola();
}

function atualizarEscola() {
	for ([key, golpe] of Object.entries(golpes)) {
		let disponivel = true;

		for ([atividade, custo] of Object.entries(golpe.custo)) {
			if (custo > atividades[atividade].valor) {
				disponivel = false;
			}
		}
		
		let botao = sel(`#escola_${golpe.alias}`)[0];
		if (disponivel && botao.classList.contains('inativo')) {
			botao.classList.remove('inativo');
		} else if (!disponivel && !botao.classList.contains('inativo')) {
			botao.classList.add('inativo');
		}
	}
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