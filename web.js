var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {

//var buf = new Buffer();
//var resp = buf.toString(fs.readFileSync(index.html), "utf-8"); 
 var buf = new Buffer(fs.readFileSync('index.html'));
 response.send(buf.toString());
//response.send('Hello World 2!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
