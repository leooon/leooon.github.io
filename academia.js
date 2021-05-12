function montaCenaAcademia() {
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
	for ([key, golpe] of golpes) {
		escolaHtml += golpe.aprenderTemplate();
	};
	escolaHtml += `</div>`
	cena.insertAdjacentHTML('beforeend', escolaHtml);

	for ([key, golpe] of golpes) {
		golpe.criarClicks();
		golpe.atualizarEscola();
	};

	clearInterval(timer);
	timer = null;
}

function updateValores() {
	for (atividade in atividades) {
		atividades[atividade].atualizarTotal();
	};

	for ([alias, golpe] of golpes) {
		golpe.atualizarEscola();
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