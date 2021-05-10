let golpes = new Map();

class Golpe {
	constructor(alias, nome, energia, respeito, custo) {
		this.alias    = alias;
		this.nome     = nome;
		this.energia  = energia;
		this.respeito = respeito;
		this.custo    = custo;

		golpes.set(alias, this);
	}

	criarClicks() {
		let botao = sel(`#escola #escola_${this.alias}`)[0];
		
		botao.alias = this.alias;
		botao.addEventListener('click', () => {
			golpes.get(this.alias).aprender();
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

			jogador.golpes.set(this.alias, 1);

			for (let [atividade, custo] of golpes.get(this.alias).custo) {
				atividades[atividade].valor -= custo;
				atividades[atividade].atualizarTotal();
			}
		}
	}

	aprenderTemplate() {
		let custoHtml = [];
		for (let [key, value] of this.custo) {
			custoHtml.push(`${value}${atividades[key].letra}`);
		};
		custoHtml = custoHtml.join(' + ');

		let html = `
			<div class="aprender_golpe inativo" id="escola_${this.alias}">
				<div class="info"><span>${this.nome}</span><br>${this.energia}e / ${this.respeito}r</div>
				<div class="botao">${custoHtml}</div>
			</div>`

		return html;
	}
}

new Golpe('airflare', 'Air Flare', 30, 45, new Map([['forca', 600], ['destreza', 400]]));
new Golpe('deadman', 'Deadman', 75, 120, new Map([['forca', 1200], ['charme', 300]]));
new Golpe('babyfreeza', 'Baby Freeza', 110, 180, new Map([['destreza', 6000], ['equilibrio', 200]]));
new Golpe('hellicopter', 'Hellicopter', 30, 80, new Map([['equilibrio', 200], ['charme', 6000]]));
new Golpe('thefrog', 'The Frog', 140, 400, new Map([['forca', 180], ['equilibrio', 3600]]));