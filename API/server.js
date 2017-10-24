
var express = require('express');
var app = express();
var cors = require('cors');
var mongojs = require('mongojs');

var mongodb = require('mongodb');

// var uri = 'mongodb://adminTFG:admintfg@ds039504.mongolab.com:39504/comprasgov';
// var uri=process.env.OPENSHIFT_MONGODB_DB_URL+'apicomplementartfg';
var uri='mongodb://localhost:27017/ComprasGov';

// -------------------------

// mongodb.MongoClient.connect(uri, function(err, db) {
//   
//   if(err) throw err;
//   
//   /*
//    * First we'll add a few songs. Nothing is required to create the 
//    * songs collection; it is created automatically when we insert.
//    */
// 
//   var dbOrgao = db.collection('Orgao');
//   var dbFornecedor = db.collection('Fornecedor');

//   ---------OR--------------

var dbOrgao = mongojs("ComprasGov", ['Orgao']);
var dbFornecedor = mongojs('ComprasGov', ['Fornecedor']);

dbOrgao=dbOrgao.Orgao;
dbFornecedor = dbFornecedor.Fornecedor;
// ------------------------

//root
app.get('/', function (req, res) {
	res.render('default.ejs', {});
});

app.use(express.static(__dirname + '/'));
app.use(cors());

//who/NAME/TITLE
app.get('/who/:name?/:title?', function (req, res) {
	var name = req.params.name;
	var title = req.params.title;
	res.render('default.ejs', {
		title: title,
		name: name
	});
});


// ----- Métodos API Complementar -----


// ----- Metodo Compra ------------- (Ajustar)
app.get('/compra*', function (req, res) {

	console.log('Requisição GET compra');

	var response = {
		qtd_total: 0,
		vl_total_estimado: 0,
		compras: new Array()
	}

	var query = {};
	if (req.query.uasg) {
		query["uasgs.id"] = parseInt(req.query.uasg);
	}
	// Ajustar aqui
	if (req.query.tipo) {
		query["xxxx"] = req.query.tipo;
	}
	if (req.query.modalidade) {
		query["uasgs.compras.modalidade"] = parseInt(req.query.modalidade);
	}
	// Ajustar aqui
	if (req.query.uf) {
		query["uasgs.XXXXX"] = req.query.uf;
	}
	// Ajustar aqui
	if (req.query.ano) {
		query["uasgs.xxxx"] = req.query.ano;
	}
	console.log('query=');
	console.log(query);

	function filtraLicitacao(compras, fSomaValItens) {

		if (req.query.uasg) {
			function isUasg(element, index, array) {
				return element.uasg == req.query.uasg;
			}

			compras = compras.filter(isUasg);
		}

		if (req.query.modalidade) {
			function isMod(element, index, array) {
				return element.modalidade == req.query.modalidade;
			}
			compras = compras.filter(isMod)
		}

		response.compras = compras;
		fSomaValItens(compras);
	}

	// function somaValorItens(compras) {
	// 	for (var i = 0; i < compras.length; i++) {
	// 		if (compras[i].itens != undefined) {
	// 			for (var j = 0; j < compras[i].itens.length; j++) {
	// 				if (compras[i].itens[j].vl_estimado != undefined) {
	// 					response.vl_total_estimado += compras[i].itens[j].vl_estimado;
	// 				}
	// 			}
	// 		}
	// 	}
	// };
	
	
	function somaValorItens(compras) {
		compras.forEach(function(ele) {
			if (ele.itens != undefined) {
				ele.itens.forEach(function(ela){
					if (ela.vl_estimado != undefined) {
						response.vl_total_estimado += ela.vl_estimado;
						for (var key in ela){
							console.log("key: "+key);
						}
						//console.log("Teste keys: "+Object.keys(ela));
					}
				});
				// for (var j = 0; j < ele.itens.length; j++) {
				// 	
				// }
			}
		});
	};
	
	// var fields={ _id:0, co_tipo_poder:0, ativo:0, co_tipo_esfera:0, no_orgao:0, co_orgao:0, uasgs:0,'uasgs.compras':1}
	dbOrgao.find(query,/*fields,*/function (err, doc) {
		console.log('--------------------------------------------------');
		for (var i = 0; i < doc.length; i++) {
			if (doc[i].uasgs != undefined) {
				for (var j = 0; j < doc[i].uasgs.length; j++) {
					if (doc[i].uasgs[j].compras != undefined) {
						for (var k = 0; k < doc[i].uasgs[j].compras.length; k++) {
							response.compras.push(doc[i].uasgs[j].compras[k]);
						}
					}
				}
			}
		}

		filtraLicitacao(response.compras, somaValorItens);
		response.qtd_total = response.compras.length;
		response.vl_total_estimado = parseFloat(response.vl_total_estimado.toFixed(2));

		res.json(response);
	});
});


app.get('/grupoCompra/uf*', function (req, res) {
	console.log('Requisição GET grupoCompra por uf');
	 var dados = new Array();
	 
	 dbOrgao.aggregate(
	
		{"$unwind":"$uasgs"}, 
		{"$unwind": "$uasgs.compras"}, 
		{"$unwind": "$uasgs.compras.itens"}, 
		// {"$group":{ "_id":"$uasgs.uf", 
		// 			"qtd_compras":{$sum:"$uasgs.compras"}, 
		// 			"vl_total_uf":{$sum: "$uasgs.compras.itens.vl_estimado"}
		// }}
		{$group:
        { _id:{'UF':"$uasgs.uf", 'Modalidade': "$uasgs.compras.modalidade",'Ano': "$uasgs.compras.ano"},
          vl_total:{$sum: "$uasgs.compras.itens.vl_estimado"},
          qtd:{$sum:1}
        }},function(err, result) {
			if(err)
				console.log("---------------ERRO----------------" + err);
				
// {
// _id: {
// 		UF: "AP",
// 		Modalidade: 7
// 		},
// vl_total: 1460070.5899999999,
// qtd: 303
// }
	
	   // --------Filtros-------
		if(req.query.modalidade){
			function isMod(element, index, array) {
				return element._id.Modalidade == req.query.modalidade;
			}
			result = result.filter(isMod);
		}
		if(req.query.ano){
			function isAno(element, index, array) {
				return element._id.Ano == req.query.ano;
			}
			result = result.filter(isAno);
		}
		if(req.query.anoInicio){
			if(req.query.anoFim){
				//range
				console.log('range');
				function isRange(element, index, array) {
					return (element._id.Ano >= req.query.anoInicio && element._id.Ano <= req.query.anoFim);
				}
				result = result.filter(isRange);
			}else{
				//só ano inicio
				console.log('maior que anoInicio');
				function isMaior(element, index, array) {
					return (element._id.Ano >= req.query.anoInicio);
				}
				result = result.filter(isMaior);
			}
		}else{
			if(req.query.anoFim){
				//só ano fim
				console.log('menor que anoFim');
				function isMenor(element, index, array) {
					return (element._id.Ano <= req.query.anoFim);
				}
				result = result.filter(isMenor);
			}
		}
		
			result.forEach(function(element){
				var existe = false;
                    if (element._id.UF != undefined) {
                        if (dados.length != 0) {
                            dados.forEach(function (e) {
                                if (element._id.UF == e.uf) {
                                    existe = true;
                                    e.quantidade += element.qtd;
									e.valor +=element.vl_total;
                                }
                            }, this);
                            if (!existe) {
                                dados.push({
                                    "uf": element._id.UF,
                                    "quantidade": element.qtd,
									"valor":element.vl_total
                                });
                            }
							
                        } else {
                            dados.push({
                                "uf": result[0]._id.UF,
                                "quantidade": result[0].qtd,
								"valor":result[0].vl_total
                            });
                        }
                    }
			}, this);
				
			 res.json(dados);
		});
});

app.get('/grupoCompra/modalidade*', function (req, res) {
	console.log('Requisição GET grupoCompra por modalidade');
	 var dados = new Array();
	 
	 dbOrgao.aggregate(
	
		{"$unwind":"$uasgs"}, 
		{"$unwind": "$uasgs.compras"}, 
		{"$unwind": "$uasgs.compras.itens"}, 
		// {"$group":{ "_id":"$uasgs.uf", 
		// 			"qtd_compras":{$sum:"$uasgs.compras"}, 
		// 			"vl_total_uf":{$sum: "$uasgs.compras.itens.vl_estimado"}
		// }}
		{$group:
        { _id:{'UF':"$uasgs.uf", 'Modalidade': "$uasgs.compras.modalidade",'Ano': "$uasgs.compras.ano"},
          vl_total:{$sum: "$uasgs.compras.itens.vl_estimado"},
          qtd:{$sum:1}
        }},function(err, result) {
			if(err)
				console.log("---------------ERRO----------------" + err);
				
// {
// _id: {
// 		UF: "AP",
// 		Modalidade: 7
// 		},
// vl_total: 1460070.5899999999,
// qtd: 303
// }
	
	 // --------Filtros-------
		if(req.query.uf){
			console.log('uf')
			function isUf(element, index, array) {
				return element._id.UF == req.query.uf;
			}
			result = result.filter(isUf)
		}
		if(req.query.ano){
			console.log('ano')
			function isAno(element, index, array) {
				return element._id.Ano == req.query.ano;
			}
			result = result.filter(isAno)
		}
		if(req.query.anoInicio){
			if(req.query.anoFim){
				//range
				console.log('range');
				function isRange(element, index, array) {
					return (element._id.Ano >= req.query.anoInicio && element._id.Ano <= req.query.anoFim);
				}
				result = result.filter(isRange);
			}else{
				//só ano inicio
				console.log('maior que anoInicio');
				function isMaior(element, index, array) {
					return (element._id.Ano >= req.query.anoInicio);
				}
				result = result.filter(isMaior);
			}
		}else{
			if(req.query.anoFim){
				//só ano fim
				console.log('menor que anoFim');
				function isMenor(element, index, array) {
					return (element._id.Ano <= req.query.anoFim);
				}
				result = result.filter(isMenor);
			}
		}
		
		
			result.forEach(function(element){
				var existe = false;
                    if (element._id.Modalidade != undefined) {
						
                        if (dados.length != 0) {
                            dados.forEach(function (e) {
                                if (element._id.Modalidade == e.codigo) {
                                    existe = true;
                                    e.quantidade += element.qtd;
									e.valor +=element.vl_total;
                                }
                            }, this);
                            if (!existe) {
								var modalidade='';
								if(element._id.Modalidade==1){
									modalidade='Convite';
								}else if(element._id.Modalidade == 2){
									modalidade='Tomada de Preços';
								}else if(element._id.Modalidade==3){
									modalidade= 'Concorrência';
								}else if(element._id.Modalidade==4){
									modalidade='Concorrência Internacional';
								}else if(element._id.Modalidade==5){
									modalidade='Pregão';
								}else if(element._id.Modalidade==6){
									modalidade='Dispensa de Licitação';
								}else if(element._id.Modalidade==7){
									modalidade='Inexigibilidade de Licitação';
								}else if(element._id.Modalidade==20){
									modalidade='Concurso';
								}else if(element._id.Modalidade==22){
									modalidade='Tomada de Preço por Técnica e Preço';
								}else if(element._id.Modalidade==33){
									modalidade='Concorrência por Técnica e Preço';
								}else if(element._id.Modalidade==44){
									modalidade='Concorrência Internacional por Técnica e Preço';
								}								
                                dados.push({
									"modalidade":modalidade,
                                    "codigo": element._id.Modalidade,
                                    "quantidade": element.qtd,
									"valor":element.vl_total
                                });
                            }
							
                        } else {
							    modalidade='';
								if(element._id.Modalidade==1){
									modalidade='Convite';
								}else if(element._id.Modalidade == 2){
									modalidade='Tomada de Preços';
								}else if(element._id.Modalidade==3){
									modalidade= 'Concorrência';
								}else if(element._id.Modalidade==4){
									modalidade='Concorrência Internacional';
								}else if(element._id.Modalidade==5){
									modalidade='Pregão';
								}else if(element._id.Modalidade==6){
									modalidade='Dispensa de Licitação';
								}else if(element._id.Modalidade==7){
									modalidade='Inexigibilidade de Licitação';
								}else if(element._id.Modalidade==20){
									modalidade='Concurso';
								}else if(element._id.Modalidade==22){
									modalidade='Tomada de Preço por Técnica e Preço';
								}else if(element._id.Modalidade==33){
									modalidade='Concorrência por Técnica e Preço';
								}else if(element._id.Modalidade==44){
									modalidade='Concorrência Internacional por Técnica e Preço';
								}		
                            dados.push({
								"modalidade":modalidade,
                                "codigo": result[0]._id.Modalidade,
                                "quantidade": result[0].qtd,
								"valor":result[0].vl_total
                            });
                        }
                    }
			}, this);
				
			 res.json(dados);
		});
});


app.get('/grupoCompra/ano*', function (req, res) {
	console.log('Requisição GET grupoCompra por ano');
	 var dados = new Array();
	 
	 dbOrgao.aggregate(
	
		{"$unwind":"$uasgs"}, 
		{"$unwind": "$uasgs.compras"}, 
		{"$unwind": "$uasgs.compras.itens"}, 
		// {"$group":{ "_id":"$uasgs.uf", 
		// 			"qtd_compras":{$sum:"$uasgs.compras"}, 
		// 			"vl_total_uf":{$sum: "$uasgs.compras.itens.vl_estimado"}
		// }}
		{$group:
        { _id:{'UF':"$uasgs.uf", 'Modalidade': "$uasgs.compras.modalidade",'Ano': "$uasgs.compras.ano"},
          vl_total:{$sum: "$uasgs.compras.itens.vl_estimado"},
          qtd:{$sum:1}
        }},function(err, result) {
			if(err)
				console.log("---------------ERRO----------------" + err);
				
// {
// _id: {
// 		UF: "AP",
// 		Modalidade: 7
// 		},
// vl_total: 1460070.5899999999,
// qtd: 303
// }
	
		if(req.query.modalidade){
			function isMod(element, index, array) {
				return element._id.Modalidade == req.query.modalidade;
			}
			result = result.filter(isMod);
		}
		if(req.query.uf){
			function isUf(element, index, array) {
				return element._id.UF == req.query.uf;
			}
			result = result.filter(isUf);
		}
		if (req.query.csl) {
			
			if (req.query.csl == 'true') {
				function isCSL(element, index, array) {
					return (element._id.Modalidade == 6 || element._id.Modalidade == 7);
				}
				result = result.filter(isCSL);
			} else {
				function isNoCSL(element, index, array) {
					return (element._id.Modalidade != 6 && element._id.Modalidade != 7);
				}
				result = result.filter(isNoCSL);
			}
		}
			result.forEach(function(element){
				var existe = false;
                    if (element._id.Ano != undefined) {
                        if (dados.length != 0) {
                            dados.forEach(function (e) {
                                if (element._id.Ano == e.ano) {
                                    existe = true;
                                    e.quantidade += element.qtd;
									e.valor +=element.vl_total;
                                }
                            }, this);
                            if (!existe) {
                                dados.push({
                                    "ano": element._id.Ano,
                                    "quantidade": element.qtd,
									"valor":element.vl_total
                                });
                            }
							
                        } else {
                            dados.push({
                                "ano": result[0]._id.Ano,
                                "quantidade": result[0].qtd,
								"valor":result[0].vl_total
                            });
                        }
                    }
			}, this);
			
				
			 res.json(dados);
		});
});



app.get('/contrato*', function (req, res) {
	console.log('Requisição GET Contrato');

	var query = {};
	if (req.query.uasg) {
		query["contratos.uasg"] = parseInt(req.query.uasg);
	}
	if (req.query.modalidade) {
		query["contratos.modalidade_licitacao"] = parseInt(req.query.modalidade);
	}
	if (req.query.tipoContrato) {
		query["contratos.co_tipo_contrato"] = parseInt(req.query.tipoContrato);
	}
	if (req.query.ano) {
		query["contratos.data_assinatura"] = { $regex: "/parseInt(req.query.ano)/" };
	}

	console.log('query=');
	console.log(query);

	var response = {
		qtd_total: 0,
		vl_total_estimado: 0,
		contratos: new Array()
	}

	function filtraLicitacao(contratos, fSomaValItens) {

		if (req.query.uasg) {
			function isUasg(element, index, array) {
				return element.uasg == req.query.uasg;
			}

			contratos = contratos.filter(isUasg);
		}

		if (req.query.modalidade) {
			function isMod(element, index, array) {
				return element.modalidade_licitacao == req.query.modalidade;
			}
			contratos = contratos.filter(isMod)
		}
		if (req.query.tipoContrato) {
			function isTipo(element, index, array) {
				return element.co_tipo_contrato == req.query.tipoContrato;
			}
			contratos = contratos.filter(isTipo)
		}
		if (req.query.ano) {
			function isAno(element, index, array) {
				console.log(element.data_assinatura.substring(0, 4) + " / " + req.query.ano)
				return element.data_assinatura.substring(0, 4) == req.query.ano;
			}
			contratos = contratos.filter(isAno)
		}

		response.contratos = contratos;
		fSomaValItens(contratos);
	}

	function somaValorItens(contratos) {
		for (var i = 0; i < contratos.length; i++) {
			if (contratos[i].vl_inicial != undefined) {
				response.vl_total_estimado += contratos[i].vl_inicial;
			}
		}
	};

	dbFornecedor.find(query,/*fields,*/function (err, doc) {
		console.log('--------------------------------------------------');
		for (var i = 0; i < doc.length; i++) {
			if (doc[i].contratos != undefined) {
				for (var j = 0; j < doc[i].contratos.length; j++) {
					response.contratos.push(doc[i].contratos[j]);
				}
			}
		}

		filtraLicitacao(response.contratos, somaValorItens);
		response.qtd_total = response.contratos.length;
		response.vl_total_estimado = parseFloat(response.vl_total_estimado.toFixed(2));

		// console.log("inteiro: "+ response.contratos[0].data_assinatura);
		// console.log("substring: "+ response.contratos[0].data_assinatura.substring(0,4));
		res.json(response);
	});

});



app.get('/grupoContrato/uf*', function (req, res) {
	console.log('Requisição GET grupoContrato por uf');
	 var dados = new Array();
	 
	 dbFornecedor.aggregate( 
    	{"$unwind":"$contratos"},
    	{$group:
        	{ _id:{'UF':"$uf", 'Modalidade': "$contratos.modalidade_licitacao", 'Ano': "$contratos.data_assinatura"},
        		vl_total:{$sum: "$contratos.vl_inicial"},
       		 	qtd:{$sum:1}
       		}},function(err, result) {
				if(err)
				console.log("---------------ERRO----------------" + err);
				
	
// --------Filtros-------
		if(req.query.modalidade){
			function isMod(element, index, array) {
				return element._id.Modalidade == req.query.modalidade;
			}
			result = result.filter(isMod);
		}
		if(req.query.ano){
			function isAno(element, index, array) {
				return element._id.Ano.substring(0, 4) == req.query.ano;
			}
			result = result.filter(isAno);
		}
		if (req.query.csl) {
			
			if (req.query.csl == 'true') {
				function isCSL(element, index, array) {
					return (element._id.Modalidade == 6 || element._id.Modalidade == 7);
				}
				result = result.filter(isCSL);
			} else {
				function isNoCSL(element, index, array) {
					return (element._id.Modalidade != 6 && element._id.Modalidade != 7);
				}
				result = result.filter(isNoCSL);
			}
		}
		if(req.query.anoInicio){
			if(req.query.anoFim){
				//range
				console.log('range');
				function isRange(element, index, array) {
					return (element._id.Ano.substring(0, 4) >= req.query.anoInicio && element._id.Ano.substring(0, 4) <= req.query.anoFim);
				}
				result = result.filter(isRange);
			}else{
				//só ano inicio
				console.log('maior que anoInicio');
				function isMaior(element, index, array) {
					return (element._id.Ano.substring(0, 4) >= req.query.anoInicio);
				}
				result = result.filter(isMaior);
			}
		}else{
			if(req.query.anoFim){
				//só ano fim
				console.log('menor que anoFim');
				function isMenor(element, index, array) {
					return (element._id.Ano.substring(0, 4) <= req.query.anoFim);
				}
				result = result.filter(isMenor);
			}
		}
		
			result.forEach(function(element){
				var existe = false;
                    if (element._id.UF != undefined) {
                        if (dados.length != 0) {
                            dados.forEach(function (e) {
                                if (element._id.UF == e.uf) {
                                    existe = true;
                                    e.quantidade += element.qtd;
									e.valor +=element.vl_total;
                                }
                            }, this);
                            if (!existe) {
                                dados.push({
                                    "uf": element._id.UF,
                                    "quantidade": element.qtd,
									"valor":element.vl_total
                                });
                            }
							
                        } else {
                            dados.push({
                                "uf": result[0]._id.UF,
                                "quantidade": result[0].qtd,
								"valor":result[0].vl_total
                            });
                        }
                    }
			}, this);
				
			 res.json(dados);
		});
});


app.get('/grupoContrato/ano*', function (req, res) {
	console.log('Requisição GET grupoContrato por ano');
	 var dados = new Array();
	 
	 dbFornecedor.aggregate( 
    	{"$unwind":"$contratos"},
    	{$group:
        	{ _id:{'UF':"$uf", 'Modalidade': "$contratos.modalidade_licitacao", 'Ano': "$contratos.data_assinatura"},
        		vl_total:{$sum: "$contratos.vl_inicial"},
       		 	qtd:{$sum:1}
       		}},function(err, result) {
			if(err)
				console.log("---------------ERRO----------------" + err);
				

			if (req.query.modalidade) {
				function isMod(element, index, array) {
					return element._id.Modalidade == req.query.modalidade;
				}
				result = result.filter(isMod);
			}
			if (req.query.uf) {
				function isUf(element, index, array) {
					return element._id.UF == req.query.uf;
				}
				result = result.filter(isUf);
			}
			if (req.query.csl) {
				if (req.query.csl == 'true') {
					function isCSL(element, index, array) {
						return (element._id.Modalidade == 6 || element._id.Modalidade == 7);
					}
					result = result.filter(isCSL);
				} else {
					function isNoCSL(element, index, array) {
						return (element._id.Modalidade != 6 && element._id.Modalidade != 7);
					}
					result = result.filter(isNoCSL);
				}
			}
			
			result.forEach(function (element) {
				var existe = false;
				if (element._id.Ano != undefined) {
					if (dados.length != 0) {
						dados.forEach(function (e) {
							if (element._id.Ano.substring(0, 4) == e.ano) {
								existe = true;
								e.quantidade += element.qtd;
								e.valor += element.vl_total;
							}
						}, this);
						if (!existe) {
							dados.push({
								"ano": element._id.Ano.substring(0, 4),
								"quantidade": element.qtd,
								"valor": element.vl_total
							});
						}

					} else {
						dados.push({
							"ano": result[0]._id.Ano.substring(0, 4),
							"quantidade": result[0].qtd,
							"valor": result[0].vl_total
						});
					}
				}
			}, this);


			res.json(dados);
		});
});


app.get('/grupoContrato/modalidade*', function (req, res) {
	console.log('Requisição GET grupoContrato por modalidade');
	 var dados = new Array();
	 
	 dbFornecedor.aggregate( 
    	{"$unwind":"$contratos"},
    	{$group:
        	{ _id:{'UF':"$uf", 'Modalidade': "$contratos.modalidade_licitacao", 'Ano': "$contratos.data_assinatura"},
        		vl_total:{$sum: "$contratos.vl_inicial"},
       		 	qtd:{$sum:1}
       		}},function(err, result) {
			if(err)
				console.log("---------------ERRO----------------" + err);
				
// {
// _id: {
// 		UF: "AP",
// 		Modalidade: 7
// 		},
// vl_total: 1460070.5899999999,
// qtd: 303
// }
	
	 // --------Filtros-------
		if(req.query.uf){
			console.log('uf')
			function isUf(element, index, array) {
				return element._id.UF == req.query.uf;
			}
			result = result.filter(isUf)
		}
		if(req.query.ano){
			console.log('ano')
			function isAno(element, index, array) {
				return element._id.Ano == req.query.ano;
			}
			result = result.filter(isAno)
		}
		if(req.query.anoInicio){
			if(req.query.anoFim){
				//range
				console.log('range');
				function isRange(element, index, array) {
					return (element._id.Ano >= req.query.anoInicio && element._id.Ano <= req.query.anoFim);
				}
				result = result.filter(isRange);
			}else{
				//só ano inicio
				console.log('maior que anoInicio');
				function isMaior(element, index, array) {
					return (element._id.Ano >= req.query.anoInicio);
				}
				result = result.filter(isMaior);
			}
		}else{
			if(req.query.anoFim){
				//só ano fim
				console.log('menor que anoFim');
				function isMenor(element, index, array) {
					return (element._id.Ano <= req.query.anoFim);
				}
				result = result.filter(isMenor);
			}
		}
		
		
			result.forEach(function(element){
				var existe = false;
                    if (element._id.Modalidade != undefined) {
						
                        if (dados.length != 0) {
                            dados.forEach(function (e) {
                                if (element._id.Modalidade == e.codigo) {
                                    existe = true;
                                    e.quantidade += element.qtd;
									e.valor +=element.vl_total;
                                }
                            }, this);
                            if (!existe) {
								var modalidade='';
								if(element._id.Modalidade==1){
									modalidade='Convite';
								}else if(element._id.Modalidade == 2){
									modalidade='Tomada de Preços';
								}else if(element._id.Modalidade==3){
									modalidade= 'Concorrência';
								}else if(element._id.Modalidade==4){
									modalidade='Concorrência Internacional';
								}else if(element._id.Modalidade==5){
									modalidade='Pregão';
								}else if(element._id.Modalidade==6){
									modalidade='Dispensa de Licitação';
								}else if(element._id.Modalidade==7){
									modalidade='Inexigibilidade de Licitação';
								}else if(element._id.Modalidade==20){
									modalidade='Concurso';
								}else if(element._id.Modalidade==22){
									modalidade='Tomada de Preço por Técnica e Preço';
								}else if(element._id.Modalidade==33){
									modalidade='Concorrência por Técnica e Preço';
								}else if(element._id.Modalidade==44){
									modalidade='Concorrência Internacional por Técnica e Preço';
								}								
                                dados.push({
									"modalidade":modalidade,
                                    "codigo": element._id.Modalidade,
                                    "quantidade": element.qtd,
									"valor":element.vl_total
                                });
                            }
							
                        } else {
							    modalidade='';
								if(element._id.Modalidade==1){
									modalidade='Convite';
								}else if(element._id.Modalidade == 2){
									modalidade='Tomada de Preços';
								}else if(element._id.Modalidade==3){
									modalidade= 'Concorrência';
								}else if(element._id.Modalidade==4){
									modalidade='Concorrência Internacional';
								}else if(element._id.Modalidade==5){
									modalidade='Pregão';
								}else if(element._id.Modalidade==6){
									modalidade='Dispensa de Licitação';
								}else if(element._id.Modalidade==7){
									modalidade='Inexigibilidade de Licitação';
								}else if(element._id.Modalidade==20){
									modalidade='Concurso';
								}else if(element._id.Modalidade==22){
									modalidade='Tomada de Preço por Técnica e Preço';
								}else if(element._id.Modalidade==33){
									modalidade='Concorrência por Técnica e Preço';
								}else if(element._id.Modalidade==44){
									modalidade='Concorrência Internacional por Técnica e Preço';
								}		
                            dados.push({
								"modalidade":modalidade,
                                "codigo": result[0]._id.Modalidade,
                                "quantidade": result[0].qtd,
								"valor":result[0].vl_total
                            });
                        }
                    }
			}, this);
				
			 res.json(dados);
		});
});


app.get('/grupoItem/modalidade*', function (req, res) {
	console.log('Requisição GET grupoItem por modalidade');
	 
	 if(req.query.tipo_compra == "Material"){
		 console.log("Material");
		 var dados = new Array();
	 dbOrgao.aggregate(
	
		{"$unwind":"$uasgs"}, 
		{"$unwind": "$uasgs.compras"}, 
		{"$unwind": "$uasgs.compras.itens"}, 
		{$group:
        { _id:{'UF':"$uasgs.uf", 'Modalidade': "$uasgs.compras.modalidade",'Ano': "$uasgs.compras.ano", "Tipo":"$uasgs.compras.itens.co_materiais"},
          vl_total:{$sum: "$uasgs.compras.itens.vl_estimado"},
          qtd:{$sum:1}
        }},function(err, result) {
			if(err)
				console.log("---------------ERRO----------------" + err);
			
			
			function isMaterial(element, index, array) {
				return element._id.Tipo != undefined;
			}
			result = result.filter(isMaterial)
			
			if(req.query.uf){
			console.log('uf')
			function isUf(element, index, array) {
				return element._id.UF == req.query.uf;
			}
			result = result.filter(isUf)
		}
		if(req.query.ano){
			console.log('ano')
			function isAno(element, index, array) {
				return element._id.Ano == req.query.ano;
			}
			result = result.filter(isAno)
		}
		if(req.query.anoInicio){
			if(req.query.anoFim){
				//range
				console.log('range');
				function isRange(element, index, array) {
					return (element._id.Ano >= req.query.anoInicio && element._id.Ano <= req.query.anoFim);
				}
				result = result.filter(isRange);
			}else{
				//só ano inicio
				console.log('maior que anoInicio');
				function isMaior(element, index, array) {
					return (element._id.Ano >= req.query.anoInicio);
				}
				result = result.filter(isMaior);
			}
		}else{
			if(req.query.anoFim){
				//só ano fim
				console.log('menor que anoFim');
				function isMenor(element, index, array) {
					return (element._id.Ano <= req.query.anoFim);
				}
				result = result.filter(isMenor);
			}
		}
		
		
			result.forEach(function(element){
				var existe = false;
                    if (element._id.Modalidade != undefined) {
						
                        if (dados.length != 0) {
                            dados.forEach(function (e) {	
                                if (element._id.Modalidade == e.codigo) {
                                    existe = true;
                                    e.quantidade += element.qtd;
									e.valor +=element.vl_total;
                                }
                            }, this);
                            if (!existe) {
								var modalidade='';
								if(element._id.Modalidade==1){
									modalidade='Convite';
								}else if(element._id.Modalidade == 2){
									modalidade='Tomada de Preços';
								}else if(element._id.Modalidade==3){
									modalidade= 'Concorrência';
								}else if(element._id.Modalidade==4){
									modalidade='Concorrência Internacional';
								}else if(element._id.Modalidade==5){
									modalidade='Pregão';
								}else if(element._id.Modalidade==6){
									modalidade='Dispensa de Licitação';
								}else if(element._id.Modalidade==7){
									modalidade='Inexigibilidade de Licitação';
								}else if(element._id.Modalidade==20){
									modalidade='Concurso';
								}else if(element._id.Modalidade==22){
									modalidade='Tomada de Preço por Técnica e Preço';
								}else if(element._id.Modalidade==33){
									modalidade='Concorrência por Técnica e Preço';
								}else if(element._id.Modalidade==44){
									modalidade='Concorrência Internacional por Técnica e Preço';
								}								
                                dados.push({
									"modalidade":modalidade,
                                    "codigo": element._id.Modalidade,
                                    "quantidade": element.qtd,
									"valor":element.vl_total
                                });
                            }
							
                        } else {
							    modalidade='';
								if(element._id.Modalidade==1){
									modalidade='Convite';
								}else if(element._id.Modalidade == 2){
									modalidade='Tomada de Preços';
								}else if(element._id.Modalidade==3){
									modalidade= 'Concorrência';
								}else if(element._id.Modalidade==4){
									modalidade='Concorrência Internacional';
								}else if(element._id.Modalidade==5){
									modalidade='Pregão';
								}else if(element._id.Modalidade==6){
									modalidade='Dispensa de Licitação';
								}else if(element._id.Modalidade==7){
									modalidade='Inexigibilidade de Licitação';
								}else if(element._id.Modalidade==20){
									modalidade='Concurso';
								}else if(element._id.Modalidade==22){
									modalidade='Tomada de Preço por Técnica e Preço';
								}else if(element._id.Modalidade==33){
									modalidade='Concorrência por Técnica e Preço';
								}else if(element._id.Modalidade==44){
									modalidade='Concorrência Internacional por Técnica e Preço';
								}		
                            dados.push({
								"modalidade":modalidade,
                                "codigo": result[0]._id.Modalidade,
                                "quantidade": result[0].qtd,
								"valor":result[0].vl_total
                            });
                        }
                    }
			}, this);
				
			 res.json(dados);
		});
		}else if(req.query.tipo_compra=="Servico"){
			console.log("Servico");
			var dados = new Array();
			dbOrgao.aggregate(
	
		{"$unwind":"$uasgs"}, 
		{"$unwind": "$uasgs.compras"}, 
		{"$unwind": "$uasgs.compras.itens"}, 
		{$group:
        { _id:{'UF':"$uasgs.uf", 'Modalidade': "$uasgs.compras.modalidade",'Ano': "$uasgs.compras.ano", "Tipo":"$uasgs.compras.itens.co_servico"},
          vl_total:{$sum: "$uasgs.compras.itens.vl_estimado"},
          qtd:{$sum:1}
        }},function(err, result) {
			if(err)
				console.log("---------------ERRO----------------" + err);
			
			function isMaterial(element, index, array) {
				return element._id.Tipo != undefined;
			}
			result = result.filter(isMaterial)
			
			if(req.query.uf){
			console.log('uf')
			function isUf(element, index, array) {
				return element._id.UF == req.query.uf;
			}
			result = result.filter(isUf)
		}
		if(req.query.ano){
			console.log('ano')
			function isAno(element, index, array) {
				return element._id.Ano == req.query.ano;
			}
			result = result.filter(isAno)
		}
		if(req.query.anoInicio){
			if(req.query.anoFim){
				//range
				console.log('range');
				function isRange(element, index, array) {
					return (element._id.Ano >= req.query.anoInicio && element._id.Ano <= req.query.anoFim);
				}
				result = result.filter(isRange);
			}else{
				//só ano inicio
				console.log('maior que anoInicio');
				function isMaior(element, index, array) {
					return (element._id.Ano >= req.query.anoInicio);
				}
				result = result.filter(isMaior);
			}
		}else{
			if(req.query.anoFim){
				//só ano fim
				console.log('menor que anoFim');
				function isMenor(element, index, array) {
					return (element._id.Ano <= req.query.anoFim);
				}
				result = result.filter(isMenor);
			}
		}
		
		
			result.forEach(function(element){
				var existe = false;
                    if (element._id.Modalidade != undefined) {
						
                        if (dados.length != 0) {
                            dados.forEach(function (e) {
                                if (element._id.Modalidade == e.codigo) {
                                    existe = true;
                                    e.quantidade += element.qtd;
									e.valor +=element.vl_total;
                                }
                            }, this);
                            if (!existe) {
								var modalidade='';
								if(element._id.Modalidade==1){
									modalidade='Convite';
								}else if(element._id.Modalidade == 2){
									modalidade='Tomada de Preços';
								}else if(element._id.Modalidade==3){
									modalidade= 'Concorrência';
								}else if(element._id.Modalidade==4){
									modalidade='Concorrência Internacional';
								}else if(element._id.Modalidade==5){
									modalidade='Pregão';
								}else if(element._id.Modalidade==6){
									modalidade='Dispensa de Licitação';
								}else if(element._id.Modalidade==7){
									modalidade='Inexigibilidade de Licitação';
								}else if(element._id.Modalidade==20){
									modalidade='Concurso';
								}else if(element._id.Modalidade==22){
									modalidade='Tomada de Preço por Técnica e Preço';
								}else if(element._id.Modalidade==33){
									modalidade='Concorrência por Técnica e Preço';
								}else if(element._id.Modalidade==44){
									modalidade='Concorrência Internacional por Técnica e Preço';
								}								
                                dados.push({
									"modalidade":modalidade,
                                    "codigo": element._id.Modalidade,
                                    "quantidade": element.qtd,
									"valor":element.vl_total
                                });
                            }
							
                        } else {
							    modalidade='';
								if(element._id.Modalidade==1){
									modalidade='Convite';
								}else if(element._id.Modalidade == 2){
									modalidade='Tomada de Preços';
								}else if(element._id.Modalidade==3){
									modalidade= 'Concorrência';
								}else if(element._id.Modalidade==4){
									modalidade='Concorrência Internacional';
								}else if(element._id.Modalidade==5){
									modalidade='Pregão';
								}else if(element._id.Modalidade==6){
									modalidade='Dispensa de Licitação';
								}else if(element._id.Modalidade==7){
									modalidade='Inexigibilidade de Licitação';
								}else if(element._id.Modalidade==20){
									modalidade='Concurso';
								}else if(element._id.Modalidade==22){
									modalidade='Tomada de Preço por Técnica e Preço';
								} else if (element._id.Modalidade == 33) {
									modalidade = 'Concorrência por Técnica e Preço';
								} else if (element._id.Modalidade == 44) {
									modalidade = 'Concorrência Internacional por Técnica e Preço';
								}
								dados.push({
									"modalidade": modalidade,
									"codigo": result[0]._id.Modalidade,
									"quantidade": result[0].qtd,
									"valor": result[0].vl_total
								});
					}
				}
		}, this);

		res.json(dados);
		});
	 }
});
			

app.get('/fornecedor*', function (req, res) {
	console.log('Requisição GET Fornecedor');

	var query = {};
	if (req.query.uasg) {
		query["id_unidade_cadastradora"] = parseInt(req.query.uasg);
	}
	if (req.query.ramoNegocio) {
		query["id_ramo_negocio"] = parseInt(req.query.ramoNegocio);
	}
	// if(req.query.tipoFornecedor){
	// 	query["id_ramo_negocio"] = parseInt(req.query.tipoFornecedor);
	// }
	if (req.query.uf) {
		query["uf"] = req.query.uf;
	}

	console.log('query=');
	console.log(query);

	var response = {
		qtd_total: 0,
		vl_total_estimado_contratos: 0,
		fornecedores: new Array()
	}

	function somaValorContratos(fornecedores) {
		for (var i = 0; i < fornecedores.length; i++) {
			if (fornecedores[i].contratos != undefined) {
				for (var j = 0; j < fornecedores[i].contratos.length; j++) {
					if (fornecedores[i].contratos[j].vl_inicial != undefined) {
						response.vl_total_estimado_contratos += fornecedores[i].contratos[j].vl_inicial;
					}
				}
			}
		}

	};

	dbFornecedor.find(query,/*fields,*/function (err, doc) {
		console.log('--------------------------------------------------');
		response.fornecedores = doc;
		response.qtd_total = response.fornecedores.length;
		somaValorContratos(response.fornecedores);
		response.vl_total_estimado_contratos = parseFloat(response.vl_total_estimado_contratos.toFixed(2));

		res.json(response);
	});
});

app.get('/uasg*', function (req, res) {
	console.log('Requisição GET Uasg');

	var query = {};
	if (req.query.orgao) {
		query["co_orgao"] = parseInt(req.query.orgao);
	}
	if (req.query.cadastradora) {
		query["uasgs.unidade_cadastradora"] = Boolean(req.query.cadastradora);
	}

	console.log('query=');
	console.log(query);

	var response = {
		qtd_total: 0,
		vl_total_estimado: 0,
		uasgs: new Array()
	}

	function filtraLicitacao(uasgs) {

		if (req.query.orgao) {
			function isOrgao(element, index, array) {
				return element.co_orgao == req.query.orgao;
			}

			uasgs = uasgs.filter(isOrgao);
		}

		if (req.query.cadastradora) {
			function isCadastradora(element, index, array) {
				console.log(element);
				console.log(element.unidade_cadastradora + " // " + req.query.cadastradora)
				return element.unidade_cadastradora == req.query.cadastradora;
			}
			uasgs = uasgs.filter(isCadastradora)
		}

		response.uasgs = uasgs;
		// fSomaValItens(uasgs);
	}
	// 
	// function somaValorItens(contratos) {
	// 	for (var i = 0; i < contratos.length; i++) {
	// 		if (contratos[i].vl_inicial != undefined) {
	// 			response.vl_total_estimado += contratos[i].vl_inicial;
	// 		}
	// 	}
	// };

	dbOrgao.find(query,/*fields,*/function (err, doc) {
		console.log('--------------------------------------------------');
		for (var i = 0; i < doc.length; i++) {
			if (doc[i].uasgs != undefined) {
				for (var j = 0; j < doc[i].uasgs.length; j++) {
					response.uasgs.push(doc[i].uasgs[j]);
				}
			}
		}

		filtraLicitacao(response.uasgs);
		response.qtd_total = response.uasgs.length;
		//response.vl_total_estimado = parseFloat(response.vl_total_estimado.toFixed(2));

		res.json(response);
	});

});

//Error
app.get('*', function (req, res) {
	res.send('Error 400 page');
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.listen(port, ipaddress, function() {
    console.log('Express has started on port 8080');
});


// });