let versao = 0.2;

function sel(t) {
	return document.querySelectorAll(t);
}
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function retornarPorcentagem(atual, total) {
	return Math.ceil((atual / total) * 100);
}

function corrigeAltura() {
	sel('#container')[0].style.height = window.innerHeight +'px';
}

document.addEventListener('DOMContentLoaded', () => {
	corrigeAltura();
	ativaMenu();

	// montaCenaAcademia();
	debug();
});
window.addEventListener('resize', corrigeAltura);

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