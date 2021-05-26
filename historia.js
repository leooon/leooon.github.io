let paginaAtual = 0;
let capitulos = [
	{
		texto: `
			Seu Teodoro está na praça comendo um churros. Pela quarta vez essa semana, a pomba passa rasteira deixando seu presente na testa de seu Teodoro.<br><br>
			Já chega, pensa seu Teodoro.<br><br>
			Hora de destruir o mundo.
		`,
		antes: function() {

		},
		depois: function() {
			paginaAtual++
			page.addEventListener('click', proximaPagina)
		}
	},
	{
		texto: `
			Tomando seu sorvete, você observa e sente o perigo.<br><br>
			É chegada a hora de ajudar o próximo.<br>
			Fazer a diferença.<br>
			Você pode ser o escolhido.<br><br>
			O peso da humanidade recai em suas costas.
		`,
		antes: function() {
			let html = `<div class="botao" id="terminarSorvete">terminar seu sorvete</div>`
			cena.insertAdjacentHTML('beforeend', html)
		},
		depois: function() {
			page.addEventListener('click', this.mostraBotao, {once: true})
		},
		mostraBotao: function() {
			let sorvete = sel('#terminarSorvete')[0]
			sorvete.classList.add('ativo')
			sorvete.addEventListener('click', capitulos[paginaAtual].vaiParaAcademia, {once: true})
		},
		vaiParaAcademia: function() {
			sel('#menu div.batalha')[0].click();
		}
	},
];

let cena;
function montaCenaHistoria() {
	cena = sel('#cena')[0]
	cena.innerHTML = ""
	cena.classList.remove(...cena.classList)
	cena.classList.add('historia')

	let html = `
		<div id="page">
			<div class="titulo">1. Seu Teodoro</div>
		</div>`
	cena.insertAdjacentHTML('beforeend', html)

	sel('#cena.historia #page')[0].addEventListener('click', entrarCapitulo)
}

function entrarCapitulo() {
	let page = sel('#cena.historia #page')[0]

	page.removeEventListener('click', entrarCapitulo)

	let cena = sel('#cena')[0];
	
	let titulo = `<div class="titulo_interno">1. Seu Teodoro</div>`
	cena.insertAdjacentHTML('afterbegin', titulo)

	proximaPagina()
}

function proximaPagina() {
	let page = sel('#cena.historia #page')[0]
	
	page.removeEventListener('click', proximaPagina)
	page.innerHTML = ""

	capitulos[paginaAtual].antes()
	
	let texto = `<div class="texto">${capitulos[paginaAtual].texto}</div>`
	page.insertAdjacentHTML('beforeend', texto)

	animar()
}

function animar() {
	let texto = sel('#cena.historia .texto')[0]
	let base = texto.innerHTML.trim()

	let limite = 1
	function avancarTexto() {
		texto.innerHTML = base.substring(0, limite) + `<span>${base.substring(limite)}</span>`
		
		if (limite == base.length) {
			clearInterval(animacao)
			page.removeEventListener('click', avancarTudo)
			capitulos[paginaAtual].depois()
		} 

		if (base[limite] == '<') {
			limite += 4
		} else {
			limite++;
		}
	}

	function avancarTudo() {
		limite = base.length
		avancarTexto()
	}

	let page = sel('#cena.historia #page')[0]
	page.addEventListener('click', avancarTudo)

	let animacao = setInterval(avancarTexto, 25)
	avancarTexto()
}