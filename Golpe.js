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
		let botao = sel(`#escola #escola_${this.alias} .botao`)[0];
		
		botao.alias = this.alias;
		botao.addEventListener('click', golpes.get(this.alias).aprender);
	}

	aprender() {
		jogador.get('golpes').set(this.alias, 1);

		for (let [atividade, custo] of golpes.get(this.alias).custo) {
			atividades[atividade].valor -= custo;
			atividades[atividade].atualizarTotal();
		}
		
		golpes.get(this.alias).atualizarEscola();
	}

	aprenderTemplate() {
		let custoHtml = [];
		for (let [key, value] of this.custo) {
			custoHtml.push(`${value}${atividades[key].letra}`);
		};
		custoHtml = custoHtml.join(' + ');

		let html = `
			<div class="aprender_golpe" id="escola_${this.alias}">
				<div class="info"><span>${this.nome}</span><br>${this.energia}e / ${this.respeito}r</div>
				<div class="botao">${custoHtml}</div>
			</div>`

		return html;
	}

	atualizarEscola() {
		let info  = sel(`#escola_${this.alias}`)[0];
		let botao = sel(`#escola #escola_${this.alias} .botao`)[0];
		
		if (jogador.get('golpes').has(this.alias)) {
			if (!info.classList.contains('aprendido')) {
				info.classList.add('aprendido');
				botao.innerHTML = "Aprendido!";
				botao.removeEventListener('click', golpes.get(this.alias).aprender);
			}
			
			return;
		}
	
		let disponivel = this.checarDisponibilidade();

		if (disponivel && info.classList.contains('inativo')) {
			info.classList.remove('inativo');
			botao.addEventListener('click', golpes.get(this.alias).aprender);
		} else if (!disponivel && !info.classList.contains('inativo')) {
			info.classList.add('inativo');
			botao.removeEventListener('click', golpes.get(this.alias).aprender);
		}
	}

	checarDisponibilidade() {
		let disponivel = true;

		for (let [atividade, custo] of this.custo) {
			if (custo > atividades[atividade].valor) {
				disponivel = false;
			}
		}

		return disponivel;
	}
}

new Golpe('airflare', 'Air Flare', 30, 45, new Map([['forca', 600], ['destreza', 400]]));
new Golpe('deadman', 'Deadman', 75, 120, new Map([['forca', 1200], ['charme', 300]]));
new Golpe('babyfreeza', 'Baby Freeza', 110, 180, new Map([['destreza', 6000], ['equilibrio', 200]]));
new Golpe('hellicopter', 'Hellicopter', 30, 80, new Map([['equilibrio', 200], ['charme', 6000]]));
new Golpe('thefrog', 'The Frog', 140, 400, new Map([['forca', 180], ['equilibrio', 3600]]));