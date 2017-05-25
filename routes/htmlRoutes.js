var express = require('express');
var methodOverride = require('method-override');

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

router.get('/user/:username', function(req, res){
	db.User.findOne({
		where: {
			username: req.params.username
		}
	}).then(function(data){
		var currentUserId = data.dataValues.id;
		db.Product.findAll({
			where: {
				UserId: currentUserId
			}
		}).then(function(data){
			for(var i = 0; i < data.length; i++){
				data[i].currentUser = req.params.username;
			}
			res.render('manage', {
				products: data,
				currentUser: req.params.username
			});
		});
	});
	
});

router.post('/user/:username' , function(req, res){
	db.User.findOne({
		where: {
			username: req.params.username
		}
	}).then(function(data){
		var userId = data.dataValues.id;
		db.Product.create({
			name: req.body.productName,
			quantity: req.body.quantity,
			price: req.body.price,
			UserId: userId
		}).then(function(data){
			res.redirect('/user/' + req.params.username);
		});
	});	
});

router.put('/user/:username/product/:productName', function(req, res){
	var newTotalAmount = parseInt(req.body.amountToAdd) + parseInt(req.body.currentAmount);
	db.Product.update({
		quantity: newTotalAmount 
	},
	{
		where: {
			UserId: req.body.userIdToAdd,
			name: req.body.productToAdd
		}
	}).then(function(data){
		res.redirect('/user/' + req.params.username);
	});
});

//routers for service section
router.get('/user/:username/service', function(req, res){
	db.User.findOne({
		where: {
			username: req.params.username
		}
	}).then(function(data){
		var currentUserId = data.dataValues.id
		db.Product.findAll({
			where: {
				UserId: currentUserId
			}
		}).then(function(data){
			res.render('service', {
				products: data,
				currentUser: req.params.username
			});
		});
	});
});

router.post('/user/:username/service/checkout', function(req, res){
	db.User.findOne({
		where: {
			username: req.params.username
		}
	}).then(function(data){
		var UserId = data.dataValues.id;
		var results = req.body.checkoutCart;
		res.send()
		for(var i = 0; i < results.length; i++){
		var newAmount = parseInt(results[i].currentAmount) - parseInt(results[i].amount);
		console.log(newAmount);
		db.Product.update({
			quantity: newAmount
		},
		{
			where: {
				name: results[i].product,
				UserId: UserId
			}
		}).then(function(data){
			if(i === results.length){
				
			}
		});
	}
	});
	
});
module.exports = router;
