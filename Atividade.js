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