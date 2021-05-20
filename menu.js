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

function montaMenu() {
	let html = `
		<div id="menu">
			<div class="historia">História</div>
			<div class="batalha ativo">Batalha</div>
			<div class="academia">Academia</div>
			<div class="config">Config.</div>
		</div>`

	sel('#container')[0].insertAdjacentHTML('beforeend', html);
}