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
	
	
	function aplicar(){
		var contMetas = 0;
		for(var i = 0; i<maquinas.length; i++){
			var nM = maquinas[i]; // nM= numero Maquina
			var m = new Maquina(nM); // objeto Maquina
			
			m.meta = document.getElementById("meta"+[i]).value;  
			m.telhaPorCiclo = document.getElementById("tc"+[i]).value; 
			m.realizadaOP = document.getElementById("cOp"+[i]).value; 
			m.realizadaTurno = document.getElementById("cT"+[i]).value; 
			m.pecaPorTelha = verificarPeca(m.numero); 
			
			var p = new Producao(m.numero, m.getProducaoTelhas(), m.getProducaoEmPeca());
			p.calculaQuilos();
			p.calculaIrog(m.meta); 
			quantidadeOp(m.numero, m.realizadaOP, m.telhaPorCiclo);
			listaMaquinas.push(m);
			listaProducao.push(p);
			if(p.proucaoTelhas>0){ 
				somasTelhas += p.proucaoTelhas;
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
			var pp = "maquina:"+p.maquina+";proucaoTelhas:"+p.proucaoTelhas+";producaoPecas:"+p.producaoPecas+";producaoQuilos:"+p.producaoQuilos+";irog:"+p.irog;
			localStorage.setItem(p.data+"_data"+p.maquina+p.turno+"_producao", pp);
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
	function Producao(maquina, telhas, pecas){
		this.maquina = maquina;
		this.proucaoTelhas = telhas;
		this.producaoPecas = pecas;
		this.producaoQuilos;
		this.irog = 0;
		this.turno = getTurno();
		this.data = getData();
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
	function getDiaDaSemana(){
		var semana = ["Domingo", "Segunda-Feira", "Terca-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sabado"];
		var d = new Date();
		return semana[d.getDay()];
	}
	
	Producao.prototype.calculaQuilos = function(){
		var qlos = this.maquina+"_peso";
		var peso = localStorage.getItem(qlos);
		return this.producaoQuilos = ((peso*this.proucaoTelhas)/1000);
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
	
	Producao.prototype.calculaIrog = function(meta){
		var irg;
		if(meta!=null){
			irg = ((this.proucaoTelhas/meta)*100);
		}
		var arredondado = parseFloat(irg.toFixed(2));
		this.irog = arredondado;
		return arredondado;
	}
	function setContatos(n , contatos, conn){
		if(n==1){
			this.contato1 = contatos[0];
		}else if(n==2){
			this.contato1 = contatos[0];
			this.contato2 = contatos[1];
		}else if(n==3){
			this.contato1 = contatos[0];
			this.contato2 = contatos[1];
			this.contato3 = contatos[2];
		}else{
			alert("inserir no máximo 3 contatos");
		}
		if(conn==null){
			this.contatoCon = "";
		}
		this.contatoCon = conn;
	}
	var contato1;
	var contato2;
	var contato3;
	var contatoCon;
	var corpoDoEmail= [];
	function sendMail() {
    var link = "mailto:"+contato1+";"+contato2
             + "?cc="+contatoCon
             + "&subject=" + escape("producao")
             + "&body=" + escape(corpoDoEmail);
    window.location.href = link;
}
// IA Inteliencia Artificial

function IA(){
	var	ultimaProducao =[];
	var ultimaMeta = [];
	
	
}