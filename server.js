var express = require('express');
var app = express();
var cors = require('cors');
var mongojs = require('mongojs');

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

//Error
app.get('*', function (req, res) {
	res.send('Error 400 page');
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 5000;
app.listen(port, ipaddress, function() {
    console.log('Express has started on port 8080');
});

// var server = app.listen('5000', function () {
// 	console.log('Painel has started');
// });
