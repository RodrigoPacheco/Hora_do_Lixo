
//console.log(dados_csv.length);

var ruas = {}; 
$(dados_csv).each(function() {
	ruas[this.LOGRADOURO.trim()] || (ruas[this.LOGRADOURO.trim()] = []);
	ruas[this.LOGRADOURO.trim()].push(this);
}); 
var logradouros = Object.keys(ruas);
logradouros.sort();

$("#busca_rua").typeahead({
	source: function(pesquisa, callBack) {
		//callBack([pesquisa, pesquisa, pesquisa]);
		var resultado = [];
		$(logradouros).each(function(i, rua){
			if (resultado.length < 10 && rua.toLowerCase().indexOf(pesquisa.toLowerCase()) >= 0) {
				resultado.push(rua);
			}
		});
		console.log(resultado.length);
		callBack(resultado);
	}
});

function mostraTela(idTela) {
	$("#div_selecionarRua,#div_resumo,#div_selecionarNum").addClass("hidden");
	$("#" + idTela).removeClass("hidden");
}

function carregaResumo(dadosRua) {
	mostraTela("div_resumo");
	$("#p_logradouro").text(dadosRua.LOGRADOURO.trim() || "N/D");
	$("#p_nroini").text(dadosRua.NROINI.trim() || "N/D");
	$("#p_nrofim").text(dadosRua.NROFIM.trim() || "N/D");
	$("#p_lado").text(dadosRua.LADO.trim() || "N/D");
	$("#p_horacoleta").text(dadosRua.HORACOLETA.trim() || "N/D");
	$("#p_diascoleta").text(dadosRua.DIASCOLETA.trim() || "N/D");
}

$("#btn_selecionarRua").click(function(){
	var rua = $("#busca_rua").val();
	if (ruas[rua]) {
		console.log(ruas[rua]);
		if (ruas[rua].length == 1) {
			carregaResumo(ruas[rua][0]);
		} else {
			mostraTela("div_selecionarNum");
			$("#p_logradouro_numero").text(rua);
		} 
	}
});

function buscaRuaPorNumero(rua, numero) {
	console.log([rua, numero, ruas[rua]]);
	var selecao = null;
	$(ruas[rua]).each(function(){
		var ini = this.NROINI.trim();
		var fim = this.NROFIM.trim();
		if (!numero || +ini <= numero && +fim >= numero) {
			selecao = this;
		}
	});
	console.log(["selecao", selecao])
	return selecao;
}

$('#btn_selecionarNum').click(function(){
	var numero = $("#busca_numero").val();
	console.log(numero);
	if (+numero) {
		var rua = $("#busca_rua").val();
		var dadosRua = buscaRuaPorNumero(rua, numero);
		if (dadosRua) {
			console.log(dadosRua);
			carregaResumo(dadosRua);
		}
	}
});

function getNextId() {
	var id = +localStorage.getItem("id") + 1;
	localStorage.setItem("id", id);
	return id;
}

$('#btn_criarLembrete').click(function(){
	var now = new Date().getTime();
	
	var next_time = new Date(now + 10*1000);// 10 segundos
	
	var id = getNextId();
	
	var numero = $("#busca_numero").val();
	console.log(numero);
	
	var rua = $("#busca_rua").val();
	var dadosRua = buscaRuaPorNumero(rua, numero);
	if (dadosRua) {
		console.log(dadosRua);

		window.plugin.notification.local.add({
			id:      id,
			title:   'Lembrete de coleta de lixo.',
			message: 'Não esqueca de recolher seu lixo. Previsão de coleta para ' + dadosRua.HORACOLETA.trim().toLowerCase() + ".",
			autoCancel: true,
			sound: 'TYPE_ALARM',
			led: '01A552',
			date:    next_time
		});
		alert("Lembrete criado com sucesso!");
	}
});