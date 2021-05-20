function montaCenaStart() {
	let cena = sel('#cena')[0];
	cena.innerHTML = "";
	cena.classList.remove(...cena.classList);
	cena.classList.add('start');

	let html = `
		<div class="titulo">
			<div>O Nome do Jogo Vai Aqui</div>
		</div>
		<div id="start-menu">
			<div class="botao" id="entrarBonito">Entrar Bonito</div>
			<div class="botao" id="entrar">Entrar</div>
		</div>`

	cena.insertAdjacentHTML('beforeend', html)

	sel('#cena.start #entrar')[0].addEventListener('click', entrar);
}

function entrar() {
	montaMenu();
	ativaMenu();
	montaCenaHistoria();
}