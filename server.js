var express = require('express');
var exphbs = require("express-handlebars");
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var path = require('path');


var app = express();
var port = process.env.PORT || 8080;
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
	type: "application/vnd.api+json"
}));
app.use(express.static(path.join(__dirname + '/public')));
app.use(require('./routes/htmlRoutes'));
app.use(require('./routes/userRoutes'));
app.use(require('./routes/productRoutes'));

app.listen(port, function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log('listening on port: ' + port);
	}
})
