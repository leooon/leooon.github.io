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

	// montaMenu();
	// ativaMenu();

	montaCenaStart();
	debug();
});
window.addEventListener('resize', corrigeAltura);