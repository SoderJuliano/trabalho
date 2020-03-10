var listaMaquinas3 = ["1019", "1407", "1408", "1409", "1410", "1552", "1553", "8833",
			"8888", "8916", "8917", "10178", "11819", "11820", "12342", "12343"];
var listaMaquinas2 = ["1548", "1549", "1620","1621","1635","1825","1684","1686","1855", "1857","1877","1878",  "1906","1907",
			"10552", "11818"];
var listaMaquinasNull = ["maquina", "maquina", "maquina", "maquina", "maquina", "maquina", "maquina", "maquina", "maquina", "maquina", "maquina",
			"maquina", "maquina", "maquina", "maquina", "maquina"];

	function novaJanelaProducao(){
		window.open('producao.html', 'janela', 'width=795, height=590, top=100, left=699, scrollbars=no, status=no, toolbar=no, location=no, menubar=no, resizable=no, fullscreen=no' );
	}
	function verificarPeca(numero){
		let ref = localStorage.getItem(numero+"_referencia");
		if(ref==null || ref==''){
			return 3.75;
		}else{
			let lista4 = ['2240', '4707', '4515', '4709'];
			let retorno;
			var arrey = ref.split("-");
			for(var i=0;i<lista4.length;i++){
				if(array[0]=='4702'){
					retorno = 6;
				}
				if(lista4[i]==arrey[0]){
					retorno = 4;
				}else{
					retorno = 3;
				}
			}
		return retorno;
		}
	}
	function turno(){
		var t = document.getElementById("turno").value;
		sessionStorage.setItem("turno", t);
	}
	
	function mudar(){ 
	document.write('<link href="css/style.css" rel="stylesheet">');
	document.write("<table id='tabela' class='tbl' style='border: solid 1px #DDD; border-collapse: collapse; padding: 3px 6px; text-align: center; color: #191970;'>");
	document.write("<tr><th colspan='3'><p id='hora' class='primeiroP'></p></th></tr>");
	//document.write("<th><button  type='button' id='ocultar_detalhes' onclick='Mudarestado()'>Ocultar Detalhes/Mostrar Detalhes</button></th></tr>");
	document.write("<tr><th>prensas</th><th>cargas feita OP</th><th>cargas feita turno</th></tr>");
	let maqs;
	if(getVao()==2){
		this.maqs = listaMaquinas2;
	}else{
		this.maqs = listaMaquinas3;
	}
	for(let i=0;i<16;i++){  
		document.write("<tr>");
		document.write("<td><label>"+this.maqs[i]+"</label></td>");
			//document.write("<td>"+this.metas[i]+"</td>");
			//document.write("<td>"+this.telhaCiclo[i]+"</td>");
			document.write("<td>"+this.cargasOP[i]+"</td>");
			document.write("<td>"+this.cargasTurno[i]+"</td>");
			document.write("</tr>");
		document.write("<br>");
	}
	document.write("<tr><td><ul id='menutt'><li><a heref='#'><button id='btn' type='button' onclick='salvar()' >Relatorio de producao</button><span>Fecha a pagina atual salvado os dados que foram inseridos. Para gerar o relatorio precisa abrir metas novamente.</span></a></ul></td></tr>");
	document.write("</table>");
	
}
function salvar(){ 
		let i =0; 
		localStorage.setItem('salva', getData()+getTurno());
		for(let i =0; i<16;i++){ 
			localStorage.setItem("cOp"+i, document.getElementById('cOp'+i).value); 
			localStorage.setItem("cT"+i, document.getElementById('cT'+i).value); 
		}
		window.close();
}
function carregaCargas(){
	let cto =[]; 
	let ct = [];
	if(localStorage.getItem('salva')==getData()+getTurno()){
		for(var i=0;i<16;i++){
			cto.push(localStorage.getItem('cOp'+i));
			ct.push(localStorage.getItem('cT'+i));
		}
	}
	let array = [cto, ct];
	return array;
}
	var ia=new InteligenciaArtificial();
	function aplicar(){ 
		var contMetas = 0; 
		var somasMetas = 0;
		let lista;
		if(getVao()==2){
			lista = this.listaMaquinas2; 
		}else if(getVao()==3){
			lista = this.listaMaquinas3;
		}
		for(var i = 0; i<lista.length; i++){ 
			var nM = lista[i]; // nM= numero Maquina
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
		ia.setUltimaProducao(p.data, p.turno);
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
		let t;
		now = new Date();
		horas = now.getHours();
		if(getDiaDaSemana()=="Sabado"){ 
			if((horas>10) && (horas<15)){
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
			if((horas>6) && (horas<15)){ 
				sessionStorage.setItem("turno", 1);
				t = 1;
			}else if((horas=>15) && (horas<24)){
				t = 2;
				sessionStorage.setItem("turno", t);
			}else if(horas=>1 && horas<6){
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
		let now = new Date();
		let h = now.getHours();
		let m = now.getMinutes();
		let s = now.getSeconds();
		let ht = "Agora sao: "+h+":"+m+":"+s+"s";
		return ht;
	}
	
	function getHoras(){
		let now = new Date();
		let h = now.getHours();
		let m = now.getMinutes();
		let s = now.getSeconds();
		let ht = h+":"+m+":"+s;
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
InteligenciaArtificial.prototype.checarOrdem = function(maquina, proxima , meta){
	let qnt =  localStorage.getItem(maquina+"_qnt");
	let produzido = localStorage.getItem(maquina+"_qntFeita");
	let pd = qnt-produzido;
	let metaMenor = meta-meta*0.2; 
	if(metaMenor>pd){
		let px = localStorage.getItem("proxima");
		localStorage.setItem(listaMaquinas2[i]+"_op", px); 
		return 1;
	}else{
		return 0;
	}
}
InteligenciaArtificial.prototype.setIdParada = function(data, dataHora){ 
	let id;
	let id_hora;
	if(localStorage.getItem('controladorParada')!=null){
		this.id = localStorage.getItem('controladorParada');
		this.id_hora = localStorage.getItem('controladorParadaHora');
	}else{
		this.id = 0;
		this.id_hora = 0;
	}
	if(this.id>480){
		this.id = 0;
		this.id_hora = 0;
	}
	this.id++;
	this.id_hora++;
	if(localStorage.getItem(this.id)!=null){
		let apagar = localStorage.getItem(this.id); 
		localStorage.removeItem(apagar);
		let apagarh = localStorage.getItem(this.id_hora); 
		localStorage.removeItem(apagarh); 
	}
	localStorage.setItem("controladorParada", this.id);
	localStorage.setItem(this.id, data);
	localStorage.setItem("controladorParadaHora", this.id_hora);
	localStorage.setItem(this.id_hora, dataHora);
}
InteligenciaArtificial.prototype.setId = function(data){ //controla o tamanho do localStorage em produção
	let id; 	
	if(localStorage.getItem("controlador")!=null){
		this.id = localStorage.getItem("controlador"); 
	}else{
		this.id=0; 
	}
	if(this.id>480){ //diminui o id por ele mesmo e começa do zero
		this.id =this.id-this.id;  
	}
	this.id++; //alert("o id e  "+this.id);
	if(localStorage.getItem(this.id)!=null){
		let apagar = localStorage.getItem(this.id); 
		localStorage.removeItem(apagar); 
	}
	localStorage.setItem("controlador", this.id);
	localStorage.setItem(this.id, data);
}
InteligenciaArtificial.prototype.setUltimaProducao = function(data, turno){ //salva uma string chave
	localStorage.setItem("ultimaPdr_turno"+turno+"_vao"+getVao(), data);
}
InteligenciaArtificial.prototype.setIdultimaParada = function(data, turno){ //salva uma string chave
	localStorage.setItem("ultimaParada_turno"+turno+"_vao"+getVao(), data);
}
InteligenciaArtificial.prototype.carregarMeta = function(turno, vao){
	if(localStorage.getItem("ultimaPdr_turno"+turno+"_vao"+getVao())!=null){ 
		let d = localStorage.getItem("ultimaPdr_turno"+turno+"_vao"+getVao()); 
		let t = turno; 
		let v = vao;
		let todasMetas = []; 
		//let lista = buscarMaquina(v, t);
		for(let i=0; i<16; i++){ 
			let string = localStorage.getItem(buscarMaquina(v, i)+"_metas"+t);  
				var m = new Maquina(getMaquinas(v)[i]);
				let s1 = string.split(";"); 
				for(let s=0;s<s1.length;s++){ 
					let s2 = s1[s].split(":"); 
					switch(s){
						case 0:
							m.telhaPorCiclo = s2[1];
							break;
						case 1:
							m.meta = s2[1];
							break;
						case 2:
							m.pecaPorTelha = s2[1];
							break;
						case 3:
							m.realizadaOP = s2[1];
							break;
							case 4:
							m.realizadaTurno = s2[1]; 
							break;
					} //switch
		} //fecha o for	
		todasMetas.push(m); // ainda dentro do for vai adicionando metas ao array	
	} //for
	//alert("IA: metas do turno "+t+" carregadas");
	return todasMetas; // se o array for preenchido sem nenhuma falha retorna ele mesmo
	}else{
		return null;
	}
} //fecha a funcao
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
				let s2 = s1.split(":");
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
		if(t==1){
			this.ultimaProducaoT1 = this.todasPdrs;
		}else if(t==2){
			this.ultimaProducaoT2 = this.todasPdrs;
		}else if(t==3){
			this.ultimaProducaoT3 = this.todasPdrs;
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
			if(qnt==null  || qnt==""){
				this.qntSet=1;
			}else{
				this.qntSet=0;
			}
			return qnt;
		}
		function pegarOpLocaLStorage(maquina){
			var m0 = maquina+"_op";
			var numero = localStorage.getItem(m0);
			if(numero==null || numero==""){
				this.opSet = 1;
			}else{
				this.opSet = 0;	
			}
			return numero;
		}
		function pegaMatrizLS(maquina){ 
			var m0 = maquina+"_matriz";
			var numero = localStorage.getItem(m0); 
			if((numero==null)|| (numero=="")){
				this.matrizReferencia = ['', ''];
				this.matrizSet = 0;
			}else{
				this.matrizSet = 1;
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
		function maiorValor(vetor){
			let maior = 0;
			for (let i = 0; i < vetor.length; i++) {
   				if ( vetor[i] > maior ) {
    	 		 	maior = i;
   				}
			}
			return maior;
		}
		function repeticoes(vetor){
			let array = [];
			if(vetor.length>0){
				for(let i=0;i<vetor.length; i++){
					let array3 = vetor[i].split("//");  
					if(array3.length<2){ 
					 	array.push(array3);
					}else{ 
						for(let y=0;y<array3.length;y++){
							array.push(array3[y]);
						}
					}
				}
			}
			return array;
		}
		function ordernar(vetor){
			let a = []; 
			let repetido = [];
			let posicao = [];
			for(let i=0;i<vetor.length;i++){ 
				repetido = [];
				for(let y =0;y<vetor.length;y++){
					if(vetor[i]==vetor[y]){
						repetido.push(vetor[y]);
						vetor.splice(y,1);
					}
					
				}
				if(repetido.length<1){
					a.push(vetor[i]);
				}else{
					a.push(repetido);
				}
			}//retorna um array de arrays
			return a;
		}
		function posicaoDuplicado(vetor, valor){
			let x = 0;
			for(let i=0;i<vetor.length;i++){
				if(valor==vetor[i][0]){
					x = i;
				}
			}
			return x;
		}
		function duplicado(vetor, valor){
			let x=0;
			for(let i=0;i<vetor.length;i++){
				//alert("valor "+ valor+" vetor[] "+ vetor[i][0]);
				if(valor.trim()==vetor[i][0].trim()){
					x = x+1; 
				}
			}// alert("retornando "+x);
			return x;
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
		function selectPrograma(){
			let x = document.getElementById('programa').value; 
			sessionStorage.setItem("pagina", x);
			if(x==1){
				window.location.href='pagina1.html';	
			}else if(x==2){
				window.location.href='pagina2.html';
			}
			else{
				window.location.href='pagina.html';
			}
			
		}
		function header(){
				document.write("<p><li><th colspan='2'>Nome <input type='text' id='nomeid' value='"+preparador+"' name='nome' /></th>");
				if(vao!=null){
					document.write('<th colspan="6" >Selecione a Linha<select onchange="selecao();"id="linha" ><option value="'+this.vao+'">'+this.vao+'</option><option value="2" >2</option><option value="3" >3</option></select></th></li></p>');
				}else{
					document.write('<th>|| Selecione a Linha<select onchange="selecao();"id="linha" ><option value="0" ></option><option value="2" >2</option><option value="3" >3</option></select></th></li></p>');
				}
				document.write("<li><ul id='menutt'><li><a heref='#'><p onclick='Metas();'>|| Editar Metas </p><span>abre o campo de edicao de metas e producao</span></a></ul></li>");	
				//document.write("<li><span><a href='index.html' >|| Voltar ao Inicio ||</a></span></li><br>");
			document.write("<p>Parte do programa <select id='programa' onchange='selectPrograma();'><option value='0'></option><option value='3'>ambas partes</option><option value='1'>primeira parte</option><option value='2'>segunda parte</option></select>");
			document.write("<button onclick='enviar();' value='Submit'>Acompanhamento</button></p><br><br>");
		}
		function selecao(){
			this.vao = document.getElementById("linha").value;  
			var preparador = document.getElementById("nomeid").value;
			localStorage.setItem("preparador", preparador);
			localStorage.setItem("vao", this.vao); 
			vaoSet = 0;
			window.location.href = 'pagina.html';
			for(var i =0; i<16; i++){
				sessionStorage.setItem('maquina'+i, buscarPre(this.vao, i));
			}
		}
		function paginaInicial(){
			window.location.href = 'index.html';
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
			window.open('metas_versao01.html', 'janela', 'width=795, height=750, top=100, left=699, scrollbars=yes, status=no, toolbar=no, location=no, menubar=no, resizable=no, fullscreen=no' );
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
function salvarProducaoTxt(string, data, turno){
	var blob = new Blob([string], {type: "application/json;utf - 8"});
	saveAs(blob, data+":_producao_turno:"+turno+".txt");
}