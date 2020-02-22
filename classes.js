function verificarLS(maquina){
		var ma = maquina+"_metas"+getTurno();
		if(localStorage.getItem(maquinas[i]+"_metas")!=null){
			return true;
		}else{
			return false;
		}
	}
	function novaJanelaProducao(){
		window.open('producao.html', 'janela', 'width=795, height=590, top=100, left=699, scrollbars=no, status=no, toolbar=no, location=no, menubar=no, resizable=no, fullscreen=no' );
	}
	function verificarPeca(numero){
		var ref = localStorage.getItem(numero+"_referencia");
		var lista4 = ['2240', '4707', '4515', '4709'];
		var retorno;
		var arrey = ref.split("-");
		for(var i=0;i<lista4.length;i++){
			if(lista4[i]==arrey[0]){
				retorno = 4;
			}else{
				retorno = 3;
			}
		}
		return retorno;
	}
	function turno(){
		var t = document.getElementById("turno").value;
		sessionStorage.setItem("turno", t);
	}
	
	var ia=new InteligenciaArtificial();
	function aplicar(){
		var contMetas = 0;
		var somasMetas = 0;
		for(var i = 0; i<maquinas.length; i++){
			var nM = maquinas[i]; // nM= numero Maquina
			var m = new Maquina(nM); // objeto Maquina
			
			m.meta = document.getElementById("meta"+[i]).value;  
			m.telhaPorCiclo = document.getElementById("tc"+[i]).value; 
			m.realizadaOP = document.getElementById("cOp"+[i]).value; 
			m.realizadaTurno = document.getElementById("cT"+[i]).value; 
			m.pecaPorTelha = verificarPeca(m.numero);
			var p = new Producao();
			p.maquina = m.numero;
			p.producaoTelhas = m.getProducaoTelhas();
			p.producaoPecas = m.getProducaoEmPeca();
			p.data = getData(); 
			p.turno = getTurno();
			p.calculaQuilos();
			p.calculaIrog(m.meta); 
			quantidadeOp(m.numero, m.realizadaOP, m.telhaPorCiclo);
			listaMaquinas.push(m);
			listaProducao.push(p);
			if(p.producaoTelhas>0){ 
				somasTelhas += p.producaoTelhas;
			}	
			if(p.producaoPecas>0){ 
				somasPecas += p.producaoPecas; 
			}
			if(m.meta>0){
				this.contMetas++;
				somasMetas += parseFloat(p.calculaIrog(m.meta));
			}
			if(p.producaoQuilos>0){
				somasQuilos += p.producaoQuilos;
			} 
			var mm = "telhaPorCiclo:"+m.telhaPorCiclo+";meta:"+m.meta+";pecaPorTelha:"+m.pecaPorTelha+";realizadaOP:"+m.realizadaOP+";realizadaTurno:"+m.realizadaTurno;
			localStorage.setItem(m.numero+"_metas"+p.turno, mm);
			var pp = "maquina:"+p.maquina+";producaoTelhas:"+p.producaoTelhas+";producaoPecas:"+p.producaoPecas+";producaoQuilos:"+p.producaoQuilos+";irog:"+p.irog;
			localStorage.setItem(p.data+"_data"+p.maquina+"_producao"+p.turno, pp);
			this.ia.setId(p.data+"_data"+p.maquina+"_producao"+p.turno);
			this.ia.setUltimaProducao(p.data+"_data"+p.maquina+"_producao"+p.turno, p.turno);
		}
		resultado(listaMaquinas, listaProducao, somasTelhas, somasPecas, somasMetas, this.contMetas, somasQuilos);
	}
	function quantidadeOp(maquina, ciclos, telhaPorCiclo){
			var produzido = ciclos*telhaPorCiclo;
			localStorage.setItem(maquina+"_qntFeita", produzido);
			//window.location.reload();
	}
	function recuperarObject(numero){
		var m = new Maquina(numero); 
		var t = getTurno();
		
		var n = numero+"_metas"+t;
		var objeto = localStorage.getItem(n); 
		var array1 = objeto.split(";"); 
		for(var i = 0; i< array1.length;i++){
			var array2 = array1[i].split(":");
			if(i==0){
				m.telhaPorCiclo = array2[1];
			}
			if(i==1){
				m.meta = array2[1];
			}
			if(i==2){
				m.pecaPorTelha = array2[1];
			}
			if(i==3){
				m.realizadaOP = array2[1];
			}
			if(i==4){
				m.realizadaTurno = array2[1];
			}
		}
		return m;
	}
	function getTurno(){
		var t;
		now = new Date();
		horas = now.getHours();
		if(getDiaDaSemana()=="Sabado"){
			if((horas=>10) && (horas<15)){
				sessionStorage.setItem("turno", 1);
				t = 1;
			}else if((horas>15) && (horas<24)){
				t = 2;
				sessionStorage.setItem("turno", t);
			}else{
				t = 3;
				sessionStorage.setItem("turno", t);
			}
		}else{
			if((horas=>6) && (horas<15)){
				sessionStorage.setItem("turno", 1);
				t = 1;
			}else if((horas=>15) && (horas<24)){
				t = 2;
				sessionStorage.setItem("turno", t);
			}else{
				t = 3;
				sessionStorage.setItem("turno", t);
			}
		}
		
		return t;
	}
	function Parada(){
	this.maquina;
	this.data;
	this.descicao;
	this.turno;
	this.hora;
}
	function Producao(){
		this.maquina;
		this.producaoTelhas;
		this.producaoPecas;
		this.producaoQuilos;
		this.irog = 0;
		this.turno; 
		this.data;
		this.parada;
	}
	function getData(){
			now = new Date();
			d = now.getDate();
			var m = 1;
			m += now.getMonth();
			y = now.getFullYear();
			var dt = d+"/"+m+"/"+y;
			return dt;
	}
	function getHours(){
		var now = new Date();
		var h = now.getHours();
		var m = now.getMinutes();
		var s = now.getSeconds();
		var ht = "Agora sao: "+h+":"+m+":"+s+"s";
		return ht;
	}
	function getHoras(){
		var now = new Date();
		var h = now.getHours();
		var m = now.getMinutes();
		var s = now.getSeconds();
		var ht = h+":"+m+":"+s+"s";
		return ht;
	}
	function getDiaDaSemana(){
		var semana = ["Domingo", "Segunda-Feira", "Terca-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sabado"];
		var d = new Date();
		return semana[d.getDay()];
	}
	
	Producao.prototype.calculaQuilos = function(){
		var qlos = this.maquina+"_peso";
		var peso = localStorage.getItem(qlos);
		return this.producaoQuilos = ((peso*this.producaoTelhas)/1000);
	}
	function Maquina(n){ // recebe o número da máquina
		this.numero = n; 
		this.meta;
		this.telhaPorCiclo;
		this.pecaPorTelha = 3.75;
		this.realizadaOP;
		this.realizadaTurno;
	}
	Maquina.prototype.getProducaoTelhas = function(){
		return this.telhaPorCiclo*this.realizadaTurno;
	}
	Maquina.prototype.getProducaoEmPeca = function(){
		var peca;
		var pdr = this.getProducaoTelhas();
		if(this.pecaPorTelha!=null){
			peca = pdr*this.pecaPorTelha;
		}else{
			peca = pdr*3.75;
		}
		return peca;
	}
	function calculaIrogTotal(telhas, meta){
		var irg;// alert(telhas);
		if(meta!=null){
			irg = ((telhas/meta)*100);
		}
		var arredondado = parseFloat(irg.toFixed(2));
		return arredondado;
	}
	Producao.prototype.calculaIrog = function(meta){
		var irg;
		if(meta!=null){
			irg = ((this.producaoTelhas/meta)*100);
		}
		var arredondado = parseFloat(irg.toFixed(2));
		this.irog = arredondado;
		return arredondado;
	}
	function setContatos(n , contatos, conn){
		if(n==1){
			this.contato1 = contatos[0];
		}else if(n==2){
			this.contato1 = contatos[0]+";"+contatos[1];
		}else if(n==3){
			this.contato1 =  contatos[0]+";"+contatos[1]+";"+contatos[2];
		}else{
			alert("inserir no máximo 3 contatos");
		}
		if(conn==":"){
			this.contatoCon = " ";
		}
		this.contatoCon = conn;
	}
	var contato1;
	var contato2;
	var contato3;
	var contatoCon;
	var corpoDoEmail= [];
	function sendMail() {
    var link = "mailto:"+contato1
             + "?cc="+contatoCon+" "
             + "&subject=" + escape("producao")
             + "&body=" + escape(corpoDoEmail);
    window.location.href = link;
}
// IA Inteliencia Artificial

function InteligenciaArtificial(){
	this.ultimaProducaoT1 =[];
	this.ultimaProducaoT2 =[];
	this.ultimaProducaoT3 =[];
	this.ultimaMetaT1 = [];
	this.ultimaMetaT3= [];
	//recuperarObject
}
InteligenciaArtificial.prototype.setId = function(data){ //controla o tamanho do localStorage em produção
	let id; 	
	if(localStorage.getItem("controlador")!=null){
		this.id = localStorage.getItem("controlador"); 
	}else{
		this.id=0; 
	}
	if(this.id>480){ alert("maior q "+this.id);
		this.id =this.id-this.id;  
	}
	this.id++; alert("o id e  "+this.id);
	if(localStorage.getItem(this.id)!=null){
		let apagar = localStorage.getItem(this.id); 
		localStorage.removeItem(apagar); 
	}
	localStorage.setItem("controlador", this.id);
	localStorage.setItem(this.id, data);
}
InteligenciaArtificial.prototype.setUltimaProducao = function(data, turno){ //salva uma string chave
	localStorage.setItem("ultimaPdr_turno"+turno, data);
}
InteligenciaArtificial.prototype.getUltimaProducao = function(turno){ //recupera uma string chave
	return localStorage.getItem("ultimaPdr_turno"+turno);
}
InteligenciaArtificial.prototype.carregarProducao = function(data, turno, vao){
		//alert("Welcome to IA");
		let d = data;
		let t = turno;
		let v = vao;
		let todasPdrs = []; // armazena todas as producoes recebidas
		for(var i=0;i<16;i++){ // percorre uma lista de maquinas. Como ambas as linhas tem a mesma quantidade foi definiodo o var 16
			var string = localStorage.getItem(data+"_data"+getMaquinas(vao)[i]+"_producao"+turno); 
			// string contem maquina:variavel;producaoTelhas:variavel;producaoPecas:variavel;producaoQuilos:variavel;irog:variavel
			var p = new Producao(); //nova instancia da classe Producao
			let s1 = string.split(";");
			for(let x=0; x<s1.length; x++){
				//let s2 = s1.split(":");
				switch(x) {
					case 0:
						p.maquina = s2[1];
						break;
					case 1:
						p.producaoTelhas = s2[1]; 
						break;
					case 2:
						p.producaoPecas = s2[1];
						break;
					case 3:
						p.producaoQuilos = s2[1];
						break;
					case 4:
						p.irog = s2[1];
						break;
				// code block
				}
			}
			this.todasPdrs.push(p);
		}
	}
function getMaquinas(va){
	this.v = va;
	if(v==2){
		return listaMaquinas2;
	}else if(v==3){
		return listaMaquinas3;
	}
}
function Producao(){
			window.open('producao.html', 'janela', 'width=600, height=900, top=100, left=699, scrollbars=yes, status=no, toolbar=no, location=no, menubar=no, resizable=no, fullscreen=no' );
}

		var vao;
		var preparador;
		var matrizReferencia;
		var arrayParadas = [];
		var matrizSet;
		var opSet;
		var qntSet;
		var matSet;
		var peSet;
		var producao1 = [];
		
		var listaMaquinas3 = ["1019", "1407", "1408", "1409", "1410", "1552", "1553", "8833",
			"8888", "8916", "8917", "10178", "11819", "11820", "12342", "12343"];
		var listaMaquinas2 = ["1548", "1549", "1620","1621","1635","1825","1684","1686","1855", "1857","1877","1878",  "1906","1907",
			"10552", "11818"];
		var listaMaquinasNull = ["maquina", "maquina", "maquina", "maquina", "maquina", "maquina", "maquina", "maquina", "maquina", "maquina", "maquina",
			"maquina", "maquina", "maquina", "maquina", "maquina"];
			
			//conjunto de matrizes da empresa....elas não mudam de numeração
		var matrizes = [ ffr020479=["02/0479", "FD/87-F"], ffr020573=["02/0573", "4707-G"],
			ffr020572=["02/0572", "4707-F"], ffr100000013687=["13687", "4711-F"], ffr020428=["02/0428", "4515-G"],
			ffr020627=["02/0627", "4709"], ffr020427=["02/0427", "4515-F"], ffr020548=["02/0548", "4718-F"],
			ffr020430=["02/0430", "CA/32-F"], ffr020431=["02/0431","CA/32-G"], ffr020450=["02/0450", "2240"],
			ffr100000013692=["13692", "4711-G"], ffr020436=["02/0436","BC/37"], ffr020612=["02/0612", "MB/188"],
			ffr020549=["02/0549", "4718-G"], ffr020466=["02/0466", "MB/185"], ffr020548=["02/0548", "4718-F"], ffr100000013691=["164291", "4719"]
		];
		var preVao3 = ["15641", "9562", "1579", "9493", "1580", "10013", "10052", "5039", "5040", "9026", "9082",
			"10179", "11703", "11748", "9734", "9769"];
		var preVao2 = ["1587", "1628", "1882", "1588", "11202", "11203", "10094", "1636", "1622", "1599", "1881",
			"1879", "1660", "1585", "10180", "11519"];
		
		setInterval(lookForChange, 1000);
		
		function lookForChange(){
			for(var i=0;i<16;i++){
				var pesoInput = "peso"+i;
				var maquinaInput = "maquina"+i; 
				var materialInput = "material"+i;
				var qntInput = "qnt"+i;
				var opInput = "op"+i;
				var referenciaInput = "referencia"+i;
				var matrizInput = "matriz"+i;
				
				var maquina = document.getElementById(maquinaInput).textContent; 
				var peso = document.getElementById(pesoInput).value;
				var material = document.getElementById(materialInput).value; 
				var qnt = document.getElementById(qntInput).value;
				var op = document.getElementById(opInput).value;
				var referencia = document.getElementById(referenciaInput).value;
				var matriz = document.getElementById(matrizInput).value;
				
				if (peso != localStorage.getItem(maquina+"_peso")) {
			    	localStorage.setItem(maquina+"_peso", peso);
			    }
				if ((material != localStorage.getItem(maquina+"_material")) && (material != null)) {
			    	localStorage.setItem(maquina+"_material", material);
			    }
				if ((qnt != localStorage.getItem(maquina+"_qnt")) && (qnt != null)) {
			    	localStorage.setItem(maquina+"_qnt", qnt);
			    }
				if ((op != localStorage.getItem(maquina+"_op")) && (op != null)) {
			    	localStorage.setItem(maquina+"_op", op);
			    }
				if ((referencia != localStorage.getItem(maquina+"_referencia")) && (referencia != null)) {
			    	localStorage.setItem(maquina+"_referencia", referencia);
			    }
				if ((matriz != localStorage.getItem(maquina+"_matriz")) && (matrizInput != null)) {
			    	localStorage.setItem(maquina+"_matriz", matriz);
			    }
			}
			for(var i=0;i<16;i++){
				var proxima = "proxima"+i;
				var proximaPesoInput = "proximaPeso"+i;
				var proximaMaterialInput = "proximaMaterial"+i;
				var poximaQntInput = "proximaQnt"+i;
				var poximaOpInput = "proximaOp"+i;
				var poximaReferenciaInput = "proximaReferencia"+i;
				var poximaMatrizInput = "proximaMatriz"+i;
				
				var proximaPeso = document.getElementById(proximaPesoInput).value;
				var proximaMaterial = document.getElementById(proximaMaterialInput).value; 
				var proximaQnt = document.getElementById(poximaQntInput).value;
				var proximaOp = document.getElementById(poximaOpInput).value; 
				var proximaReferencia = document.getElementById(poximaReferenciaInput).value; 
				var proximaMatriz = document.getElementById(poximaMatrizInput).value;  
				
				if((proximaPeso != localStorage.getItem(proximaPesoInput)) && (proximaPeso!= "")){
					localStorage.setItem(proxima+"_peso", proximaPeso);
				}
				if((proximaMaterial != localStorage.getItem(proximaMaterialInput)) && (proximaMaterial!= "")){
					localStorage.setItem(proxima+"_material", proximaMaterial);
				}
				if((proximaOp != localStorage.getItem(proxima+"_op")) && (proximaOp!= "")){
					localStorage.setItem(proxima+"_op", proximaOp);
				}
				if(proximaReferencia != localStorage.getItem(poximaReferenciaInput)){
					localStorage.setItem(proxima+"_referencia", proximaReferencia);
				}
				if(proximaMatriz != localStorage.getItem(poximaMatrizInput)){
					localStorage.setItem(proxima+"_matriz", proximaMatriz);
				}
			}
		}
		function buscarIndice(maquina, vao){
			if(vao == 2){
				for(var i = 0; i<listaMaquinas2; i++){
					if(listaMaquinas2[i]==maquina){
						return i;
					}
				}
			}else if(vao == 3){
				for(var i = 0; i<listaMaquinas3; i++){
					if(listaMaquinas3[i]==maquina){
						return i;
					}
				}
			}
		}
		function pegarPesoLocalStorage(maquina){
			var m = maquina+"_peso";
			var peso = localStorage.getItem(m);
			
			return peso;
		}
		function pegarMaterialLocalStorage(maquina){
			var m = maquina+"_material";
			var material = localStorage.getItem(m);
			
			return material;
		}
		function pegarQuantidade(maquina){
			var m = maquina+"_qnt";
			var qnt = localStorage.getItem(m);
			if(qnt==null){
				this.qntSet=1;
			}else{
				this.qntSet=0;
			}
			return qnt;
		}
		function pegarOpLocaLStorage(maquina){
			var m0 = maquina+"_op";
			var numero = localStorage.getItem(m0);
			if(numero==null){
				this.opSet = 1
			}else{
				this.opSet = 0;	
			}
			return numero;
		}
		function pegaMatrizLS(maquina){
			var m0 = maquina+"_matriz";
			var numero = localStorage.getItem(m0);
			if((numero==null)|| (numero=="")){
				this.matrizReferencia = ["matriz "+maquina, placeholder='referencia'];
				this.matrizSet = 1;
			}else{
				this.matrizSet = 0;
				var n = numero.split('');
				var test = n[0]+n[1]+n[2]+n[3]+n[4]+n[5]+n[6];
				for(var i = 0; i< this.matrizes.length; i++){
					if(test==matrizes[i][0]){
						this.matrizReferencia = matrizes[i];
					}else{
						var test2 = n[n.length-4]+n[n.length-3]+n[n.length-2]+n[n.length-1]+n[n.length];
						if(test2==matrizes[i][0]){
							this.matrizReferencia = matrizes[i];
						}else{
							var m1 = maquina+"_referencia";
							var numero2 = localStorage.getItem(m1);
							this.matrizReferencia = [numero, numero2];
						}
					}
				}
			}
		}
		function retornaTamanhoLista(linha){
			if(vao==3){
				return listaMaquinas3;
			}else if(vao==2){
				return listaMaquinas2;
			}else if((vao=="") || (vao==null) || (vao="undefined") ){
				return listaMaquinasNull;
			}
		}
		function buscarPre(linha, indice){
			var retorno = "";
			if(linha==3){
				retorno =  preVao3[indice];
			}else if(linha==2){
				retorno = preVao2[indice];
			}
			return retorno;
		}
		function buscarMaquina(linha, maq){
			var vao = linha;
			if(vao==3){
				return listaMaquinas3[maq];
			}else if(vao==2){
				return listaMaquinas2[maq];
			}else if((vao=="") || (vao==null) || (vao="undefined") ){
				return listaMaquinasNull[maq];
			}
		}
		function init(){
			/*arrayParadas = [paradasMaq0, paradasMaq1,paradasMaq2,paradasMaq3,paradasMaq4,paradasMaq5,paradasMaq6,paradasMaq7,paradasMaq8,paradasMaq9,paradasMaq10,paradasMaq11,
			paradasMaq12,paradasMaq13,paradasMaq14,paradasMaq15];*/
			//alert("Bem vindo "+localStorage.getItem("preparador")+" do vão "+localStorage.getItem("vao"));
			if((vao==null) || (vao=="undefined") || (vao="")){ 
				this.vao = localStorage.getItem("vao"); 
			}
			if(localStorage.getItem("preparador")==null){
				this.preparador = " ";
			}else{
				this.preparador = localStorage.getItem("preparador");
			}
			for(var i =0; i<16; i++){
				sessionStorage.setItem('maquina'+i, buscarPre(this.vao, i));
			}
// aqui carrega toda a página
			pagina();
		}
		function selecao(){
			alert(document.getElementById("linha").value);
			this.vao = document.getElementById("linha").value;  
			var preparador = document.getElementById("nomeid").value;
			localStorage.setItem("preparador", preparador);
			localStorage.setItem("vao", this.vao); 
			vaoSet = 0;
			window.location.href = 'index.html';
			for(var i =0; i<16; i++){
				sessionStorage.setItem('maquina'+i, buscarPre(this.vao, i));
			}
		}
		function paginaInicial(){
			window.location.href = 'index.html';
		}
		function pagina(){
		document.write("<form name='meu_form' method='GET' action='programa.html'>");
		document.write("<div id='prensas'>");
		if(this.vao == 4){
				
		}else{
				document.write("<li>");
				document.write("<th colspan='2'>Nome <input type='text' id='nomeid' value='"+preparador+"' name='nome' /></th>");
				if(vao!=null){
					document.write('<th colspan="6" >Selecione a Linha<select onchange="selecao();"id="linha" ><option value="'+this.vao+'">'+this.vao+'</option><option value="2" >2</option><option value="3" >3</option></select></th>');
				}else{
					document.write('<th>Selecione a Linha<select onchange="selecao();"id="linha" ><option value="0" ></option><option value="2" >2</option><option value="3" >3</option></select></th>');
				}
				document.write("<li><span class='labelMetas' onclick='Metas();'>|| Editar Metas </span>");	
				document.write("<a href='index.html' >|| Voltar ao Inicio ||</span><br>");
				document.write("<button onclick='enviar();' value='Submit'>* Acompanhamento</button><br><br>");
				document.write("</li></li>");
				
			for(var n=0;n<16;n++){
				pegaMatrizLS(buscarMaquina(getVao(), n));
				salvarNumeroDaMaquina(buscarMaquina(getVao(), n), n);
				document.write("<table>");
				document.write("<th id='maquina"+n+"' onclick='novaJanelaParada("+n+");'>"+buscarMaquina(getVao(), n)+"</th>"); 
				document.write("<th id='proxima"+n+"'>"+buscarPre(getVao(), n)+"</th>");
				
				document.write("<tr>");
				if(this.matrizSet == 1){
					document.write("<td><input type='text'id='matriz"+n+"' placeholder='"+this.matrizReferencia[0]+"'></input></td>");
					document.write("<td><input type='int'  id='referencia"+n+"' placeholder='"+this.matrizReferencia[1]+"'></input></td>");
				}else{
					document.write("<td><input type='text'id='matriz"+n+"' value='"+this.matrizReferencia[0]+"'></input></td>");
					document.write("<td><input type='int'  id='referencia"+n+"' value='"+this.matrizReferencia[1]+"'></input></td>");
				}
				if(this.opSet == 1){
					document.write("<td><input type='int' placeholder='OP' id='op"+n+"' ></input></td>");
				}else{
					document.write("<td><input type='int' placeholder='OP' id='op"+n+"' value='"+pegarOpLocaLStorage(buscarMaquina(getVao(), n))+"'></input></td>");
				}
				if(this.qntSet == 1){
					document.write("<td><input type='int' placeholder='quantidade' id='qnt"+n+"'></input></td>");
				}else{
					document.write("<td><input type='int' placeholder='quantidade' value='"+pegarQuantidade(buscarMaquina(getVao(), n))+"' id='qnt"+n+"'></input></td>");
				}
				if(this.matSet == 1){
					document.write("<td><input type='text' placeholder='material' id='material"+n+"'></input></td>");
				}else{
					document.write("<td><input type='text' placeholder='material' id='material"+n+"' value='"+pegarMaterialLocalStorage(buscarMaquina(getVao(), n))+"'></input></td>");
				}
				if(this.peSet == 1){
					document.write("<td><input type='int' placeholder='peso' id='peso"+n+"'></input></td><br>");
				}else{
					document.write("<td><input type='int' placeholder='peso' id='peso"+n+"' value='"+pegarPesoLocalStorage(buscarMaquina(getVao(), n))+"'></input></td><br>");
				}
				document.write("</tr>");
				document.write("<tr>");
				// próxima ordem
				pegaMatrizLS('proxima'+n, n);
				localStorage.setItem('proxima'+n,'proxima'+n);
				if(this.matrizSet == 1){
					document.write("<td><input class='proximaCinza' type='text' id='proximaMatriz"+n+"' placeholder='"+this.matrizReferencia[0]+"'</input></td>");
					document.write("<td><input class='proximaCinza' type='int' id='proximaReferencia"+n+"' placeholder='"+this.matrizReferencia[1]+"'></input></td>");
				}else{
					document.write("<td><input class='proximaCinza' type='text'id='proximaMatriz"+n+"' value='"+this.matrizReferencia[0]+"'</input></td>");
					document.write("<td><input class='proximaCinza' type='int'  id='proximaReferencia"+n+"' value='"+this.matrizReferencia[1]+"'></input></td>");
				}
				if(this.opSet == 1){
					document.write("<td><input  class='proximaCinza' type='int' placeholder='OP' id='proximaOp"+n+"'></input></td>");
				}else{
					document.write("<td><input  class='proximaCinza' type='int' placeholder='OP' id='proximaOp"+n+"' value='"+pegarOpLocaLStorage('proxima'+n)+"'></input></td>");
				}if(this.qntSet == 1){
					document.write("<td><input  class='proximaCinza' type='int' placeholder='quantidade' id='proximaQnt"+n+"'></input></td>");
				}else{
					document.write("<td><input  class='proximaCinza' type='int' placeholder='quantidade' value='"+pegarQuantidade('proxima'+n)+"' id='proximaQnt"+n+"'></input></td>");
				}
				if(this.matSet == 1){
					document.write("<td><input class='proximaCinza' type='text' placeholder='material' id='proximaMaterial"+n+"'></input></td>");
				}else{
					document.write("<td><input class='proximaCinza' type='text' placeholder='material' id='proximaMaterial"+n+"' value='"+pegarMaterialLocalStorage('proxima'+n)+"'></input></td>");
				}
				if(this.peSet == 1){
					document.write("<td><input class='proximaCinza' type='int' placeholder='peso' id='proximaPeso"+n+"'></input></td>");
				}else{
					document.write("<td><input class='proximaCinza' type='int' placeholder='peso' id='proximaPeso"+n+"' value='"+pegarPesoLocalStorage('proxima'+n)+"'></input></td>");
				}
				document.write("</tr>");
				document.write("</table>");	
			}
			document.write("<button onclick='enviar();' value='Submit'>Enviar</button>");
			document.write("</form>");
		}
		document.write("</div>");
				document.write('<input type="text" value="'+regulador+'"/>');
				this.vao = document.getElementById("linha").value;
	}
		
		function getVao(){
			this.vao = localStorage.getItem("vao");
			if(this.vao==null){
				this.vao = 0;
			}
			return this.vao;
		}
		
		function novaJanelaParada(maquina){
			var m = localStorage.getItem("maquina"+maquina);
			sessionStorage.setItem("parada", m);
			window.open('paradas.html', 'janela', 'width=595, height=490, top=100, left=699, scrollbars=no, status=no, toolbar=no, location=no, menubar=no, resizable=no, fullscreen=no' );
		}
		function Metas(){
			window.open('metas_versao01.html', 'janela', 'width=595, height=750, top=100, left=699, scrollbars=yes, status=no, toolbar=no, location=no, menubar=no, resizable=no, fullscreen=no' );
		}
		function salvarMatrizLS(matriz, ref){
			localStorage.setItem(matriz, ref);
		}
		function salvarMaquina(maquina, matriz){
			localStorage.setItem(maquina+"_matriz", matriz);
		}
		function salvarNumeroDaMaquina(maquina, i){ 
			localStorage.setItem("maquina"+i, maquina);
		}
		function salvarOP(maquina, op){
			localStorage.setItem(maquina+"_op", op);
		}
		function salvarQnt(maquina, qnt){ 
			localStorage.setItem(maquina+"_qnt", qnt);
		}
		function salvarQntFeita(maquina, qntFeita){ 
			localStorage.setItem(maquina+"_qntFeita", qntFeita);
		}
		function salvarPeso(maquina, peso){ 
			localStorage.setItem(maquina+"_peso", peso);
		}
		function salvarMaterial(maquina, material){ 
			localStorage.setItem(maquina+"_material", material);
		}
		function salvarReferencia(maquina, referencia){
			localStorage.setItem(maquina+"_referencia", referencia);
		}
		function enviar(){
		//maquina 0
			salvarMatrizLS(document.getElementById('matriz0').value,document.getElementById('referencia0').value);
			salvarMaquina(document.getElementById('maquina0').textContent ,document.getElementById('matriz0').value);
			salvarOP(document.getElementById('maquina0').textContent, document.getElementById('op0').value);
			salvarReferencia(document.getElementById('maquina0').textContent, document.getElementById('referencia0').value);
			salvarMaterial(document.getElementById('maquina0').textContent, document.getElementById('material0').value);
			salvarQnt(document.getElementById('maquina0').textContent, document.getElementById('qnt0').value);
			//salvarQntFeita(document.getElementById('maquina0').textContent, document.getElementById('qnt_pdz0').value);
			salvarPeso(document.getElementById('maquina0').textContent, document.getElementById('peso0').value);
			
		// maquina 1
		
			salvarMatrizLS(document.getElementById('matriz1').value,document.getElementById('referencia1').value);
			salvarMaquina(document.getElementById('maquina1').textContent ,document.getElementById('matriz1').value);
			salvarOP(document.getElementById('maquina1').textContent, document.getElementById('op1').value);
			salvarReferencia(document.getElementById('maquina1').textContent, document.getElementById('referencia1').value);
			salvarMaterial(document.getElementById('maquina1').textContent, document.getElementById('material1').value);
			salvarQnt(document.getElementById('maquina1').textContent, document.getElementById('qnt1').value);
			//salvarQntFeita(document.getElementById('maquina1').textContent, document.getElementById('qnt_pdz1').value);
			salvarPeso(document.getElementById('maquina1').textContent, document.getElementById('peso1').value);
			
		// maquina 2
		
			salvarMatrizLS(document.getElementById('matriz2').value,document.getElementById('referencia2').value);
			salvarMaquina(document.getElementById('maquina2').textContent ,document.getElementById('matriz2').value);
			salvarOP(document.getElementById('maquina2').textContent, document.getElementById('op2').value);
			salvarReferencia(document.getElementById('maquina2').textContent, document.getElementById('referencia2').value);
			salvarMaterial(document.getElementById('maquina2').textContent, document.getElementById('material2').value);
			salvarQnt(document.getElementById('maquina2').textContent, document.getElementById('qnt2').value);
			//salvarQntFeita(document.getElementById('maquina2').textContent, document.getElementById('qnt_pdz2').value);
			salvarPeso(document.getElementById('maquina2').textContent, document.getElementById('peso2').value);
			
		// maquina 3
		
			salvarMatrizLS(document.getElementById('matriz3').value,document.getElementById('referencia3').value);
			salvarMaquina(document.getElementById('maquina3').textContent ,document.getElementById('matriz3').value);
			salvarOP(document.getElementById('maquina3').textContent, document.getElementById('op3').value);
			salvarReferencia(document.getElementById('maquina3').textContent, document.getElementById('referencia3').value);
			salvarMaterial(document.getElementById('maquina3').textContent, document.getElementById('material3').value);
			salvarQnt(document.getElementById('maquina3').textContent, document.getElementById('qnt3').value);
			//salvarQntFeita(document.getElementById('maquina3').textContent, document.getElementById('qnt_pdz3').value);
			salvarPeso(document.getElementById('maquina3').textContent, document.getElementById('peso3').value);
			
		// maquina 4
		
			salvarMatrizLS(document.getElementById('matriz4').value,document.getElementById('referencia4').value);
			salvarMaquina(document.getElementById('maquina4').textContent ,document.getElementById('matriz4').value);
			salvarOP(document.getElementById('maquina4').textContent, document.getElementById('op4').value);
			salvarReferencia(document.getElementById('maquina4').textContent, document.getElementById('referencia4').value);
			salvarMaterial(document.getElementById('maquina4').textContent, document.getElementById('material4').value);
			salvarQnt(document.getElementById('maquina4').textContent, document.getElementById('qnt4').value);
			//salvarQntFeita(document.getElementById('maquina4').textContent, document.getElementById('qnt_pdz4').value);
			salvarPeso(document.getElementById('maquina4').textContent, document.getElementById('peso4').value);
			
		// maquina 5
		
			salvarMatrizLS(document.getElementById('matriz5').value,document.getElementById('referencia5').value);
			salvarMaquina(document.getElementById('maquina5').textContent ,document.getElementById('matriz5').value);
			salvarOP(document.getElementById('maquina5').textContent, document.getElementById('op5').value);
			salvarReferencia(document.getElementById('maquina5').textContent, document.getElementById('referencia5').value);
			salvarMaterial(document.getElementById('maquina5').textContent, document.getElementById('material5').value);
			salvarQnt(document.getElementById('maquina5').textContent, document.getElementById('qnt5').value);
			//salvarQntFeita(document.getElementById('maquina5').textContent, document.getElementById('qnt_pdz5').value);
			salvarPeso(document.getElementById('maquina5').textContent, document.getElementById('peso5').value);
			
		// maquina 6
		
			salvarMatrizLS(document.getElementById('matriz6').value,document.getElementById('referencia6').value);
			salvarMaquina(document.getElementById('maquina6').textContent ,document.getElementById('matriz6').value);
			salvarOP(document.getElementById('maquina6').textContent, document.getElementById('op6').value);
			salvarReferencia(document.getElementById('maquina6').textContent, document.getElementById('referencia6').value);
			salvarMaterial(document.getElementById('maquina6').textContent, document.getElementById('material6').value);
			salvarQnt(document.getElementById('maquina6').textContent, document.getElementById('qnt6').value);
			//salvarQntFeita(document.getElementById('maquina6').textContent, document.getElementById('qnt_pdz6').value);
			salvarPeso(document.getElementById('maquina6').textContent, document.getElementById('peso6').value);
			
		// maquina 7
		
			salvarMatrizLS(document.getElementById('matriz7').value,document.getElementById('referencia7').value);
			salvarMaquina(document.getElementById('maquina7').textContent ,document.getElementById('matriz7').value);
			salvarOP(document.getElementById('maquina7').textContent, document.getElementById('op7').value);
			salvarReferencia(document.getElementById('maquina7').textContent, document.getElementById('referencia7').value);
			salvarMaterial(document.getElementById('maquina7').textContent, document.getElementById('material7').value);
			salvarQnt(document.getElementById('maquina7').textContent, document.getElementById('qnt7').value);
			//salvarQntFeita(document.getElementById('maquina7').textContent, document.getElementById('qnt_pdz7').value);
			salvarPeso(document.getElementById('maquina7').textContent, document.getElementById('peso7').value);
		
		// maquina 8
		
			salvarMatrizLS(document.getElementById('matriz8').value,document.getElementById('referencia8').value);
			salvarMaquina(document.getElementById('maquina8').textContent ,document.getElementById('matriz8').value);
			salvarOP(document.getElementById('maquina8').textContent, document.getElementById('op8').value);
			salvarReferencia(document.getElementById('maquina8').textContent, document.getElementById('referencia8').value);
			salvarMaterial(document.getElementById('maquina8').textContent, document.getElementById('material8').value);
			salvarQnt(document.getElementById('maquina8').textContent, document.getElementById('qnt8').value);
			//salvarQntFeita(document.getElementById('maquina8').textContent, document.getElementById('qnt_pdz8').value);
			salvarPeso(document.getElementById('maquina8').textContent, document.getElementById('peso8').value);
			
		// maquina 9
		
			salvarMatrizLS(document.getElementById('matriz9').value,document.getElementById('referencia9').value);
			salvarMaquina(document.getElementById('maquina9').textContent ,document.getElementById('matriz9').value);
			salvarOP(document.getElementById('maquina9').textContent, document.getElementById('op9').value);
			salvarReferencia(document.getElementById('maquina9').textContent, document.getElementById('referencia9').value);
			salvarMaterial(document.getElementById('maquina9').textContent, document.getElementById('material9').value);
			salvarQnt(document.getElementById('maquina9').textContent, document.getElementById('qnt9').value);
			//salvarQntFeita(document.getElementById('maquina9').textContent, document.getElementById('qnt_pdz9').value);
			salvarPeso(document.getElementById('maquina9').textContent, document.getElementById('peso9').value);
			
		// maquina 10
		
			salvarMatrizLS(document.getElementById('matriz10').value,document.getElementById('referencia10').value);
			salvarMaquina(document.getElementById('maquina10').textContent ,document.getElementById('matriz10').value);
			salvarOP(document.getElementById('maquina10').textContent, document.getElementById('op10').value);
			salvarReferencia(document.getElementById('maquina10').textContent, document.getElementById('referencia10').value);
			salvarMaterial(document.getElementById('maquina10').textContent, document.getElementById('material10').value);
			salvarQnt(document.getElementById('maquina10').textContent, document.getElementById('qnt10').value);
			//salvarQntFeita(document.getElementById('maquina10').textContent, document.getElementById('qnt_pdz10').value);
			salvarPeso(document.getElementById('maquina10').textContent, document.getElementById('peso10').value);
			
		// maquina 11
		
			salvarMatrizLS(document.getElementById('matriz11').value,document.getElementById('referencia11').value);
			salvarMaquina(document.getElementById('maquina11').textContent ,document.getElementById('matriz11').value);
			salvarOP(document.getElementById('maquina11').textContent, document.getElementById('op11').value);
			salvarReferencia(document.getElementById('maquina11').textContent, document.getElementById('referencia11').value);
			salvarMaterial(document.getElementById('maquina11').textContent, document.getElementById('material11').value);
			salvarQnt(document.getElementById('maquina11').textContent, document.getElementById('qnt11').value);
			//salvarQntFeita(document.getElementById('maquina11').textContent, document.getElementById('qnt_pdz11').value);
			salvarPeso(document.getElementById('maquina11').textContent, document.getElementById('peso11').value);
			
		// maquina 12
		
			salvarMatrizLS(document.getElementById('matriz12').value,document.getElementById('referencia12').value);
			salvarMaquina(document.getElementById('maquina12').textContent ,document.getElementById('matriz12').value);
			salvarOP(document.getElementById('maquina12').textContent, document.getElementById('op12').value);
			salvarReferencia(document.getElementById('maquina12').textContent, document.getElementById('referencia12').value);
			salvarMaterial(document.getElementById('maquina12').textContent, document.getElementById('material12').value);
			salvarQnt(document.getElementById('maquina12').textContent, document.getElementById('qnt12').value);
			//salvarQntFeita(document.getElementById('maquina12').textContent, document.getElementById('qnt_pdz12').value);
			salvarPeso(document.getElementById('maquina12').textContent, document.getElementById('peso12').value);
			
		// maquina 13
			salvarMatrizLS(document.getElementById('matriz13').value,document.getElementById('referencia13').value);
			salvarMaquina(document.getElementById('maquina13').textContent ,document.getElementById('matriz13').value);
			salvarOP(document.getElementById('maquina13').textContent, document.getElementById('op13').value);
			salvarReferencia(document.getElementById('maquina13').textContent, document.getElementById('referencia13').value);
			salvarMaterial(document.getElementById('maquina13').textContent, document.getElementById('material13').value);
			salvarQnt(document.getElementById('maquina13').textContent, document.getElementById('qnt13').value);
			//salvarQntFeita(document.getElementById('maquina13').textContent, document.getElementById('qnt_pdz13').value);
			salvarPeso(document.getElementById('maquina13').textContent, document.getElementById('peso13').value);
			
		// maquina 14
		
			salvarMatrizLS(document.getElementById('matriz14').value,document.getElementById('referencia14').value);
			salvarMaquina(document.getElementById('maquina14').textContent ,document.getElementById('matriz14').value);
			salvarOP(document.getElementById('maquina14').textContent, document.getElementById('op14').value);
			salvarReferencia(document.getElementById('maquina14').textContent, document.getElementById('referencia14').value);
			salvarMaterial(document.getElementById('maquina14').textContent, document.getElementById('material14').value);
			salvarQnt(document.getElementById('maquina14').textContent, document.getElementById('qnt14').value);
			//salvarQntFeita(document.getElementById('maquina14').textContent, document.getElementById('qnt_pdz14').value);
			salvarPeso(document.getElementById('maquina14').textContent, document.getElementById('peso14').value);
			
		// maquina 15
		
			salvarMatrizLS(document.getElementById('matriz15').value,document.getElementById('referencia15').value);
			salvarMaquina(document.getElementById('maquina15').textContent ,document.getElementById('matriz15').value);
			salvarOP(document.getElementById('maquina15').textContent, document.getElementById('op15').value);
			salvarReferencia(document.getElementById('maquina15').textContent, document.getElementById('referencia15').value);
			salvarMaterial(document.getElementById('maquina15').textContent, document.getElementById('material15').value);
			salvarQnt(document.getElementById('maquina15').textContent, document.getElementById('qnt15').value);
		//	salvarQntFeita(document.getElementById('maquina15').textContent, document.getElementById('qnt_pdz15').value);
			salvarPeso(document.getElementById('maquina15').textContent, document.getElementById('peso15').value);
			
			for(var x=0;x<16;x++)
			{
				var referencia = document.getElementById('proximaReferencia'+x).value;
				var matriz = document.getElementById('proximaMatriz'+x).value;
				var maquina = "proxima"+x;
				var op = document.getElementById('proximaOp'+x).value;
				var referencia = document.getElementById('proximaReferencia'+x).value;
				var material = document.getElementById('proximaMaterial'+x).value;
				var quantidade = document.getElementById('proximaQnt'+x).value;
				var peso = document.getElementById('proximaPeso'+x).value;
				salvarMatrizLS(matriz , referencia);
				salvarMaquina(maquina ,matriz);
				salvarOP(maquina, op);
				salvarReferencia(maquina,referencia);
				salvarMaterial(maquina, material);
				salvarQnt(maquina, quantidade);
				salvarPeso(maquina, peso);
			}
		}