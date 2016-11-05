var express = require('express');
var path = require('path');

var app = express();

app.use(express.static('dist'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, function(err) {
	if(err) {
		return console.log('Hubo un error: ' + err), process.exit(1);
	}
	console.log("servidor levantado y escuchando en el puerto 3000...")
})