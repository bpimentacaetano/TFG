(function () {

    // var HOST = "http://apicomplementartfg-bpimenta.rhcloud.com";
    var HOST = "http://localhost:8080";
    
    
    var selected = 0;
    var app = angular.module('TestApp', ['chartServices']);


    app.controller('geralController', geralController);

    function geralController() {

    }

    app.controller('barController', ['$scope', '$http', 'mapService', 'pieService', 'bubbleService', 'columnService', 'barService', 'lineService', function ($scope, $http, mapS, pieS, bubbleS, columnS, barS, lineS) {


        $('.triggerSobre').click(function () {
            $('.modal-wrapper').toggleClass('open');
            $('.painel').toggleClass('blur');
            return false;
        });

        $scope.statusMap = 0.1;
        
        // ---------------LOADER--------------------------
        $('head style[type="text/css"]').attr('type', 'text/less');
        less.refreshStyles();
        var transform_styles = ['-webkit-transform', '-ms-transform', 'transform'];
        window.randomize = function () {
            var rotation = Math.floor($scope.statusMap * 180);
            var fill_rotation = rotation;
            var fix_rotation = rotation * 2;
            for (i in transform_styles) {
                $('.circle .fill, .circle .mask.full').css(transform_styles[i], 'rotate(' + fill_rotation + 'deg)');
                $('.circle .fill.fix').css(transform_styles[i], 'rotate(' + fix_rotation + 'deg)');
            }
        }
        setTimeout(window.randomize, 200);
       
        // -------------------------------------------------

        $scope.grCM=new Array();
        $scope.ano = [2000, 2015];
        $scope.anoTitulo = "de 2000 a 2015";
        $scope.uf = "";
        $scope.ufTitulo = "no Brasil";
        $scope.compra = {
            qtdCsl: 0,
            qtdC: 0
        }
        reqRes(HOST+"/grupoCompra/modalidade?"+getParam(), "pieBuble");
        reqRes(HOST+"/grupoCompra/uf?"+getParam(), "mapBar");
        column($scope.ano, $scope.uf);
        line($scope.uf);
        

        var anoSlider = new Array;;
        $("#slider-range").slider({
            range: true,
            min: 2000,
            max: 2015,
            values: [2000, 2015],
            slide: function (event, ui) {
                for (var i = 2000; i <= 2015; i++) {
                    $("#step" + i).removeClass('current');
                }
                anoSlider = ui.values;
                for (var i = anoSlider[0]; i <= anoSlider[1]; i++) {
                    $("#step" + i).addClass('current');
                }
            },
            change: function (event, ui) {
                $scope.ano = anoSlider;
                load(0);
                $('.painelShadow').show();
                column(anoSlider, $scope.uf);
                reqRes(HOST+"/grupoCompra/modalidade?"+getParam(), "pieBuble");
                reqRes(HOST+"/grupoCompra/uf?"+getParam(), "mapBar");         
            }
        });
        
        function getParam(){
            var str = "";
            if ($scope.ano.length == 2) {
                if ($scope.ano[0] == $scope.ano[1]) {
                    str += "ano=" + $scope.ano[0] + "&";
                } else {
                    str += "anoInicio=" + $scope.ano[0] + "&anoFim" + $scope.ano[1] + "&";
                }
            }
            if ($scope.uf != "") {
                str += "uf=" + $scope.uf;
            }
            return str;
        }
        
        function reqRes(url, aux){
            $http.get(url)
                .then(function (req) {
                    if(aux=="pieBuble"){
                        $scope.grCM=req.data;
                        pie($scope.ano, $scope.uf);
                        bubble($scope.ano, $scope.uf)
                    }else if(aux=="mapBar"){
                        $scope.grCUf=req.data;
                        mapa($scope.ano);
                        bar($scope.ano);
                    }
                });
        }

        function load(x) {
            $scope.statusMap += x;
            window.randomize();
        }

        function mapa(ano) {
            // var url = "";
            // if (ano.length == 2) {
            //     if (ano[0] == ano[1]) {
            //         url = HOST+"/grupoCompra/uf?ano=" + ano[0];
            //         $scope.anoTitulo = "no ano " + ano[0];
            //     } else {
            //         url = HOST+"/grupoCompra/uf?anoInicio=" + ano[0] + "&anoFim=" + ano[1];
            //         $scope.anoTitulo = "de " + ano[0] + " a " + ano[1];
            //     }
            // } else {
            //     if (ano == 0) {
            //         url = HOST+"/grupoCompra/uf";
            //     }
            // }

            var dados = new Array();

                    $scope.grCUf.forEach(function (element) {
                        dados.push({
                            "uf": element.uf,
                            "hc-key": "br-" + (element.uf).toLowerCase(),
                            "value": element.quantidade,
                            "id": element.uf
                        });

                    }, this);

                    load(0.05);
                    mapS.map(dados, $scope);
        }

        function pie(ano, uf) {

            var urlContrato = HOST+"/grupoContrato/modalidade?";
            //var urlCompra = HOST+"/grupoCompra/modalidade?";
            // if (ano.length == 2) {
            //     if (ano[0] == ano[1]) {
            //         urlContrato += "ano=" + ano[0] + "&";
            //         urlCompra += "ano=" + ano[0] + "&";
            //     } else {
            //         urlContrato += "anoInicio=" + ano[0] + "&anoFim" + ano[1] + "&";
            //         urlCompra += "anoInicio=" + ano[0] + "&anoFim" + ano[1] + "&";
            //     }
            // }
            // if (uf != "") {
            //     urlContrato += "uf=" + uf;
            //     urlCompra += "uf=" + uf;
            // }

            var qtdContratoCsl = 0;
            var qtdContratoC = 0;

            var qtdCompraCsl = 0;
            var qtdCompraC = 0;

            var porcentagemCsl = 0;
            var porcentagemC = 0;


            // console.log("urlCompra: " + urlCompra);
            // console.log("urlContrato: " + urlContrato);

            // $http.get(urlCompra)
            //     .then(function (req) {
                    if ($scope.grCM != "") {
                        $scope.grCM.forEach(function (element) {
                            if (element.codigo == 6 || element.codigo == 7) {
                                qtdCompraCsl += element.quantidade;
                            } else {
                                qtdCompraC += element.quantidade;
                            }
                        }, this);
                     }
                // });

            $http.get(urlContrato)
                .then(function (req) {
                    if (req.data != "") {
                        req.data.forEach(function (element) {
                            if (element.codigo == 6 || element.codigo == 7) {
                                qtdContratoCsl += element.quantidade;
                            } else {
                                qtdContratoC += element.quantidade;
                            }
                        }, this);

                        setTimeout(function () {
                            porcentagemC = ((qtdCompraC * 100) / qtdContratoC) / 100;
                            porcentagemCsl = ((qtdCompraCsl * 100) / qtdContratoCsl) / 100;

                            console.log("(" + qtdCompraC + "* 100) / " + qtdContratoC + ") / 100");

                            console.log("porcentagemC" + porcentagemC);
                            console.log("porcentagemCsl: " + porcentagemCsl);
                            if (parseFloat(porcentagemC.toPrecision(2)) > 1) {
                                pieS.drawPie("pieL", 1.01, '#9A3877');
                            } else {
                                pieS.drawPie("pieL", porcentagemC.toPrecision(2), '#9A3877');
                            }

                            if (parseFloat(porcentagemCsl.toPrecision(2)) > 1) {
                                pieS.drawPie("pieCSL", 1.01, '#38719A');
                            } else {
                                pieS.drawPie("pieCSL", porcentagemCsl.toPrecision(2), '#38719A');
                            }
                            load(0.13);
                        }, 4000);

                        


                    }
                });
        }



        function bubble(ano, uf) {
            d3.select('#bubbleContainer svg').remove();

            //var url = HOST+"/grupoCompra/modalidade?";

            // if (ano.length == 2) {
            //     if (ano[0] == ano[1]) {
            //         url += "ano=" + ano[0] + "&";
            //     } else {
            //         url += "anoInicio=" + ano[0] + "&anoFim" + ano[1] + "&";
            //     }
            // }
            // if (uf != "") {
            //     url += "uf=" + uf;
            // }

            var dadosBuble = {
                name: "flare",
                children: []
            }

            
           
            // $http.get(url)
            //     .then(function (req) {
                    if ($scope.grCM != "") {
                        $scope.grCM.forEach(function (element) {
                            var csl = false;
                            if (element.codigo == 6 || element.codigo == 7) {
                                csl = true;
                            }
                            dadosBuble.children.push({
                                "name": element.modalidade,
                                "size": element.quantidade,
                                "csl": csl
                            });

                        }, this);
                    } else {
                        dadosBuble.children.push({
                            "name": 'Não há dados',
                            "size": 1,
                            "csl": true
                        });
                    }
                    bubbleS.drawBubble(dadosBuble);
                    load(0.19);
                // });

        }

        function column(ano, uf) {
            var countColumn=0;
            var urlMaterial = HOST+"/grupoItem/modalidade?tipo_compra=Material&";
            var urlServico = HOST+"/grupoItem/modalidade?tipo_compra=Servico&";
            if (ano.length == 2) {
                if (ano[0] == ano[1]) {
                    urlMaterial += "ano=" + ano[0] + "&";
                    urlServico += "ano=" + ano[0] + "&";
                } else {
                    urlMaterial += "anoInicio=" + ano[0] + "&anoFim" + ano[1] + "&";
                    urlServico += "anoInicio=" + ano[0] + "&anoFim" + ano[1] + "&";
                }
            }
            if (uf != "") {
                urlMaterial += "uf=" + uf;
                urlServico += "uf=" + uf;
            }
            
            var barSerie={
                data1:[],
                data2:[]
            }
            
            barSerie.data1[0]=0;
            barSerie.data1[1]=0;
            barSerie.data2[0]=0;
            barSerie.data2[1]=0;
                   
              $http.get(urlMaterial)
                .then(function (req) {
                    if (req.data != "") {
                         req.data.forEach(function (element) {
                             if (element.codigo == 6 || element.codigo == 7) {
                                 barSerie.data1[0]+=element.quantidade;
                             }else{
                                 barSerie.data2[0]+=element.quantidade;
                             }
                         });
                         columnS.column(barSerie.data1, barSerie.data2, $scope, countColumn++);
                    }});
                    
              $http.get(urlServico)
                .then(function (req) {
                    if (req.data != "") {
                         req.data.forEach(function (element) {
                             if (element.codigo == 6 || element.codigo == 7) {
                                 barSerie.data1[1]+=element.quantidade;
                             }else{
                                 barSerie.data2[1]+=element.quantidade;
                             }
                         });
                         load(0.15);
                         columnS.column(barSerie.data1, barSerie.data2, $scope, countColumn++);
                         
                        //  setTimeout(function () { 
                        // // console.log("data1: " + barSerie.data1[0] + " data2: " + barSerie.data2[0]);
                        // columnS.column(barSerie.data1, barSerie.data2, $scope);
                      // }, 5000);
                    }});
                    
                    
                    
          
        }

        function bar(ano) {
            $scope.barPronta=false;
            var countBar=0;
           // var url1 = HOST+"/grupoCompra/uf?";
            var url2 = HOST+"/grupoContrato/uf?";

            if (ano.length == 2) {
                if (ano[0] == ano[1]) {
               //     url1 += "ano=" + ano[0] + "&";
                    url2 += "ano=" + ano[0] + "&";
                } else {
                 //   url1 += "anoInicio=" + ano[0] + "&anoFim" + ano[1];
                    url2 += "anoInicio=" + ano[0] + "&anoFim" + ano[1];
                }
            }

            var barSerie = {
                categoria: [],
                dados1: [],
                dados2: []
            };


                    if ($scope.grCUf != "") {
                        $scope.grCUf.forEach(function (element1) {
                            barSerie.categoria.push(element1.uf);
                            barSerie.dados1.push(element1.quantidade);
                        }, this);
                    }
    
            $http.get(url2)
                .then(function (req2) {
                    if (req2.data != "") {
                        barSerie.categoria.forEach(function (el) {
                            req2.data.forEach(function (element2) {
                                if (el == element2.uf) {
                                    barSerie.dados2.push(element2.quantidade);
                                }
                            }, this);
                        }, this);
                    }
                    
                    load(0.24);
                    barS.bar(barSerie, $scope);
                    $(".painelShadow").hide();
                    // setTimeout(function () { 
                    //     if($scope.barPronta){
                    //         d3.select('#bubbleContainer .highcharts-container').remove();
                    //         barS.bar(barSerie, $scope);
                    //     }else{
                    //         barS.bar(barSerie, $scope);
                    //     }
                    //     if($scope.linePronta){
                    //         $(".painelShadow").hide(); 
                    //     }else{
                    //       setTimeout(function () { },2000);
                    //     }
                    // }, 6000);
                   
                });
        }

        function line(uf) {
            $scope.linePronta=false;
            var countLine=0;
            var url1 = HOST+"/grupoCompra/ano?csl=true&";
            var url2 = HOST+"/grupoCompra/ano?csl=false&";
            if (uf != '') {
                url1 += "uf=" + uf;
                url2 += "uf=" + uf;
            }

            var dados1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $http.get(url1)
                .then(function (req) {
                    if (req.data != "") {
                        req.data.forEach(function (element) {
                            if (element.ano == 2000) {
                                dados1[0] = element.quantidade;
                            }
                            if (element.ano == 2001) {
                                dados1[1] = element.quantidade;
                            }
                            if (element.ano == 2002) {
                                dados1[2] = element.quantidade;
                            }
                            if (element.ano == 2003) {
                                dados1[3] = element.quantidade;
                            }
                            if (element.ano == 2004) {
                                dados1[4] = element.quantidade;
                            }
                            if (element.ano == 2005) {
                                dados1[5] = element.quantidade;
                            }
                            if (element.ano == 2006) {
                                dados1[6] = element.quantidade;
                            }
                            if (element.ano == 2007) {
                                dados1[7] = element.quantidade;
                            }
                            if (element.ano == 2008) {
                                dados1[8] = element.quantidade;
                            }
                            if (element.ano == 2009) {
                                dados1[9] = element.quantidade;
                            }
                            if (element.ano == 2010) {
                                dados1[10] = element.quantidade;
                            }
                            if (element.ano == 2011) {
                                dados1[11] = element.quantidade;
                            }
                            if (element.ano == 2012) {
                                dados1[12] = element.quantidade;
                            }
                            if (element.ano == 2013) {
                                dados1[13] = element.quantidade;
                            }
                            if (element.ano == 2014) {
                                dados1[14] = element.quantidade;
                            }
                            if (element.ano == 2015) {
                                dados1[15] = element.quantidade;
                            }
                        });
                        lineS.line(dados1, dados2, $scope, countLine++); 
                    }
                });


            var dados2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $http.get(url2)
                .then(function (req) {
                    if (req.data != "") {
                        req.data.forEach(function (element) {
                            if (element.ano == 2000) {
                                dados2[0] = element.quantidade;
                            }
                            if (element.ano == 2001) {
                                dados2[1] = element.quantidade;
                            }
                            if (element.ano == 2002) {
                                dados2[2] = element.quantidade;
                            }
                            if (element.ano == 2003) {
                                dados2[3] = element.quantidade;
                            }
                            if (element.ano == 2004) {
                                dados2[4] = element.quantidade;
                            }
                            if (element.ano == 2005) {
                                dados2[5] = element.quantidade;
                            }
                            if (element.ano == 2006) {
                                dados2[6] = element.quantidade;
                            }
                            if (element.ano == 2007) {
                                dados2[7] = element.quantidade;
                            }
                            if (element.ano == 2008) {
                                dados2[8] = element.quantidade;
                            }
                            if (element.ano == 2009) {
                                dados2[9] = element.quantidade;
                            }
                            if (element.ano == 2010) {
                                dados2[10] = element.quantidade;
                            }
                            if (element.ano == 2011) {
                                dados2[11] = element.quantidade;
                            }
                            if (element.ano == 2012) {
                                dados2[12] = element.quantidade;
                            }
                            if (element.ano == 2013) {
                                dados2[13] = element.quantidade;
                            }
                            if (element.ano == 2014) {
                                dados2[14] = element.quantidade;
                            }
                            if (element.ano == 2015) {
                                dados2[15] = element.quantidade;
                            }
                        });
                    }
                    load(0.15);
                    lineS.line(dados1, dados2, $scope, countLine++); 
                    $(".painelShadow").hide();
                    // setTimeout(function () { lineS.line(dados1, dados2, $scope); 
                    //  if($scope.barPronta){
                    //     $(".painelShadow").hide(); 
                    //  }else{
                    //       setTimeout(function () { $(".painelShadow").hide();},2000);
                    //  }
                    //   }, 5000);
                });
            

            
        }

        $scope.selUf = function (uf) {
            load(0);
            $scope.uf = uf;
            $('.painelShadow').show();
            if (uf == '') {
                //   d3.select("#iconMapa").remove();
                d3.select("#iconMapa").style("background-image", "url('/img/icon_mapa_click.png')");
                d3.select("#iconMapa").on("mouseover", function () {
                    d3.select("#iconMapa").style("background-image", "url('/img/icon_mapa_click.png')");
                }).on("mouseout", function () {
                    d3.select("#iconMapa").style("background-image", "url('/img/icon_mapa_click.png')");
                });
                $scope.ufTitulo = "no Brasil";
                $("#mapContainer").highcharts().get($scope.uf).select();
            } else {
                d3.select("#iconMapa").style("background-image", "url('/img/icon_mapa.png')");
                d3.select("#iconMapa").on("mouseover", function () {
                    d3.select("#iconMapa").style("background-image", "url('/img/icon_mapa_click.png')");
                }).on("mouseout", function () {
                    d3.select("#iconMapa").style("background-image", "url('/img/icon_mapa.png')");
                });
                $scope.ufTitulo = "em " + uf;
            }
            
            reqRes(HOST+"/grupoCompra/modalidade?"+getParam(), "pieBuble");
            d3.select('#bubbleContainer svg').remove();
            column($scope.ano, uf);
            line(uf);
        }
    }]);

    app.controller('navigationBar', function ($http, pieS) {


    });

})();