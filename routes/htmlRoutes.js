var express = require('express');
var router = express.Router();
var db = require('./../models');

router.get('/', function(req, res){
	res.render('login', {
		message: 'Hello'
	});
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
			console.log('login successful');
		}
		else{
			res.redirect('/');
		}
	})
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
	});
});

router.get('/user/:username', function(req, res){
	var currentUser = req.params.username;
	db.Product.findAll({
		where: {
			UserId: currentUser
		}
	}).then(function(data){
		console.log(data);
	})
	res.render('manage');
	console.log(currentUser);
});

module.exports = router;
