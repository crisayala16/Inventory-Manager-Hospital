var express = require('express');
var methodOverride = require('method-override');
var helpers = require('handlebars-helpers');
var comparison = helpers.comparison();
var router = express.Router();
router.use(methodOverride("_method"));
var db = require('./../models');

router.get('/', function(req, res){
	res.render('login');
});

router.post('/', function(req, res){
	db.User.findOne({
		where: {
			username: req.body.userName
		}
	}).then(function(data){
		var userName = data.dataValues.username;
		var password = data.dataValues.password;
		
		if(password === req.body.password){
			res.redirect('/user/' + userName);
		}
		else{
			res.send('Sorry Invalid username or pssword!');
		}
	}).catch(function(err){
		res.status(400).send('Sorry, Invalid username or password!');
	});
});

router.get('/signUp', function(req, res){
	res.render('signUp');
});

router.post('/signUp', function(req, res){
	var name = req.body.name;
	var userName = req.body.userNameSign;
	var password = req.body.passwordSign;
	db.User.create({
		name: name,
		username: userName,
		password: password
	}).then(function(data){
		res.redirect('/');
	}).catch(function(err){
		res.status(400).send("Please fill out all input fields");
	})
});

module.exports = router;
