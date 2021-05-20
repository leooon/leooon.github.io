const jogador = new Map();
jogador.set('golpes', new Map());
jogador.set('atividades', new Map());

let saveData = {};
function save() {
	saveData.atividades = {};
	for (atividade in atividades) {
		saveData['atividades'][atividade] = atividades[atividade].valor;
	}
	localStorage.setItem('saveData', JSON.stringify(saveData));
}

function load() {
	saveData = JSON.parse(localStorage.getItem('saveData'));
}