/* global data2 */
/* global data1 */

var chartServices = angular.module('chartServices', []);

chartServices.service('mapService', function () {
    this.map = function (data, scope) {
        var mapChart = new Highcharts.Map({
            chart: {
                renderTo: 'mapContainer'
            },
            title: {
                text: 'Quantidade de Compras por Estado ' + scope.anoTitulo
            },
            mapNavigation: {
                enabled: false
            },
            legend: {
                align: "right",
                x: -210
            },
            colorAxis: {
                min: 0,
                minColor: '#E6E7E8',
                maxColor: '#009A6F'
            },
            plotOptions: {
                series: {
                    point: {
                        events: {
                            select: function () {
                                scope.selUf(this.uf);
                            },
                            unselect: function () {
                            }
                        }
                    }
                }
            },
            series: [{
                data: data,
                mapData: Highcharts.maps['countries/br/br-all'],
                joinBy: 'hc-key',
                name: 'Quantidade de Compras',
                allowPointSelect: true,
                cursor: 'pointer',
                states: {
                    hover: {
                        color: '#003626'
                    },
                    select: {
                        color: '#003626'
                    },
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.uf}',
                    color: '#000000'
                }
            }]
        });

        if (scope.uf != "") {
            if (mapChart.get(scope.uf)) {
                mapChart.get(scope.uf).color = '#003626';
            }
        }

    }
});


chartServices.service('pieService', function () {

    this.drawPie = function (div, data, cor) {
        var canvas = document.getElementById(div);
        var ctx = canvas.getContext("2d");
        //dimensions
        var W = canvas.width;
        var H = canvas.height;
        //Variables
        var degrees = 0;
        var new_degrees = 0;
        var difference = 0;
        var color = cor; //green looks better to me
        var bgcolor = "#EEE";
        var text;
        var animation_loop, redraw_loop;

        function init() {
            //Clear the canvas everytime a chart is drawn
            ctx.clearRect(0, 0, W, H);
            //Background 360 degree arc
            ctx.beginPath();
            ctx.strokeStyle = bgcolor;
            ctx.lineWidth = 30;
            ctx.arc(W / 2, H / 2, 100, 0, Math.PI * 2, false); //you can see the arc now
            ctx.stroke();
            //gauge will be a simple arc
            //Angle in radians = angle in degrees * PI / 180
            var radians = 0;
            if ((degrees * Math.PI / 180) > 0) {
                var radians = degrees * Math.PI / 180;
            }
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 30;
            //The arc starts from the rightmost end. If we deduct 90 degrees from the angles
            //the arc will start from the topmost end
            ctx.arc(W / 2, H / 2, 100, 0 - 90 * Math.PI / 180, radians - 90 * Math.PI / 180, false); 
            //you can see the arc now
            ctx.stroke();
            //Lets add the text
            ctx.fillStyle = color;
            ctx.font = "50px bebas";
            text = Math.round(degrees / 360 * 100) + "%";
            //Lets center the text
            //deducting half of text width from position x
            text_width = ctx.measureText(text).width;
            //adding manual value to position y since the height of the text cannot
            //be measured easily. There are hacks but we will keep it manual for now.
            ctx.fillText(text, W / 2 - text_width / 2, H / 2 + 15);
        }

        function draw() {
            //Cancel any movement animation if a new chart is requested
            if (typeof animation_loop != undefined) clearInterval(animation_loop);
            new_degrees = Math.round(data * 360);
            difference = new_degrees - degrees;
            //This will animate the gauge to new positions
            //The animation will take 1 second
            //time for each frame is 1sec / difference in degrees
            animation_loop = setInterval(animate_to, 1000 / difference);
        }
	
        //function to make the chart move to new degrees
        function animate_to() {
            //clear animation loop if degrees reaches to new_degrees
            if (degrees == new_degrees)
                clearInterval(animation_loop);
            if (degrees < new_degrees)
                degrees++;
            else
                degrees--;
            init();
        }
        //Lets add some animation for fun
        draw();
        //redraw_loop = setInterval(draw, 2000); //Draw a new chart every 2 seconds
    }
});

chartServices.service('bubbleService', function () {
    this.drawBubble = function (data) {

        var diameter = 960,
            format = d3.format(",d"),
            color = d3.scale.ordinal()
                .range(["#eee", "#7ec0ee", "#0D2A46"]);

        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "rgba(0, 0, 0, 0.75)")
            .style("border-radius", "6px")
            .style("font", "12px sans-serif")
            .text("tooltip");

        var pack = d3.layout.pack()
            .sort(null)
            .size([diameter, diameter])
            .padding(1.5);

        var svg = d3.select("#bubbleContainer").append("svg")
            .attr("viewBox", "0 0 960 960")
            .attr("perserveAspectRatio", "xMinYMid")
            .attr("width", diameter)
            .attr("height", diameter)
            .append("g");

        var node = svg.selectAll(".node")
            .data(pack.nodes(flatten(data))
                .filter(function (d) { console.log(d3.scale.category20c()); return !d.children; }))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
        node.append("circle")
            .attr("r", function (d) { return d.r; }).style("fill", function (d) { return d.csl ? '#9A3877' : '#38719A' })
            .on("mouseover", function (d) {
                tooltip.text(d.name + ": " + format(d.value));
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });

        node.append("text")
            .text(function (d) { return d.name; })
            .style("font-size", function (d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 22) + "px"; })
            .attr("class", "bubbleName")
            .attr("dy", "-0.05em");
            
          

        // Returns a flattened hierarchy containing all leaf nodes under the root.
        function flatten(root) {
            var nodes = [];

            function recurse(node) {
                if (node.children) node.children.forEach(recurse);
                else nodes.push({ name: node.name, value: node.size, csl: node.csl });
            }

            recurse(root);
            return { children: nodes };
        }

        d3.select(self.frameElement).style("height", diameter + "px");

        function startTimeline() {
            var tl = new TimelineMax();
            var circle = $('.node circle').get();
            var text = $('.node text');

            function shuffle(o) {
                for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }

            shuffle(circle);

            tl.set(circle, {
                left: 0,
                scale: 0
            })

            tl.set(text, {
                left: 0,
                opacity: 0
            })

            tl.staggerTo(circle, 0.8, {
                scale: 1,
                ease: Elastic.easeOut.config(1),
            }, 0.04)

            tl.to(text, 0.5, {
                opacity: 1,
            })
        }
        startTimeline();
    }
});


chartServices.service('barService', function () {
    this.bar = function (barSerie, scope) {
      //  barSerie.categoria.sort();
        var barChart = new Highcharts.Chart({
            chart: {
                renderTo: 'barContainer',
                type: 'bar'
            },
            title: {
                text: 'Quantidade de Compras e Contratos por Estado ' + scope.anoTitulo
            },

            xAxis: [{
                tickPixelInterval: -0.3,
                min: 0,
                title: {
                    text: 'Estados'
                },
                categories: barSerie.categoria
            }],
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: 70,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                borderWidth: 1
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                bar: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0,
                    groupPadding: -0.4
                }
            },
            series: [{
                name: 'Compras',
                color: 'rgba(165,170,217,1)',
                data: barSerie.dados1,
                pointPadding: 0.3,
                pointPlacement: -0.1
            }, {
                    name: 'Contratos Fechados',
                    color: 'rgba(126,86,134,.9)',
                    data: barSerie.dados2,
                    pointPadding: 0.4,
                    pointPlacement: -0.1
                }]
        });
        scope.barPronta = true;
    }
});

chartServices.service('lineService', function () {
    this.line = function (data1, data2, scope, count) {
        console.log("countCLine: " + count);
        if (count == 1) {
            var lineChart = new Highcharts.Chart({
                chart: {
                    renderTo: 'lineContainer',
                    type: 'line'
                },
                title: {
                    text: 'Quantidade de Compras ' + scope.ufTitulo,
                    x: -20 //center
                },
                xAxis: {
                    categories: ['2000', '2001', '2002', '2003', '2004', '2005',
                        '2006', '2007', '2008', '2009', '2010', '2011', '2012',
                        '2013', '2014', '2015']
                },
                yAxis: {
                    min: '0',
                    title: {
                        text: 'Quantidade'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                legend: {
                    verticalAlign: 'bottom'
                },
                series: [{
                    name: 'Quantidade de Compras Sem Licitações',
                    data: data1,
                    type: 'spline',
                    color: '#9A3877'
                }, {
                        name: 'Quantidade de Licitações',
                        data: data2,
                        type: 'spline',
                        color: '#38719A'
                    }]

            })
            scope.linePronta = true;
        }
    }
});

chartServices.service('columnService', function () {
    this.column = function (data1, data2, scope, count) {
        console.log("countColumn: " + count);
        if (count == 1) {
            var columnChart = new Highcharts.Chart({
                chart: {
                    renderTo: 'columnContainer',
                    type: 'column'
                },
                title: {
                    text: 'Quantidade de compras do tipo material e serviço ' + scope.ufTitulo + " " + scope.anoTitulo
                },
                xAxis: {
                    categories: ['Material', 'Serviço']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Quantidade'
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: [{
                    name: 'Compras Sem Licitações',
                    data: data1,
                    color: "#9A3877",
                }, {
                        name: 'Licitações',
                        data: data2,
                        color: "#38719A"
                    }]
            });
        }
    }

});




      
         
   