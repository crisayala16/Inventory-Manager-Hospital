var express = require('express');
var methodOverride = require('method-override');
var helpers = require('handlebars-helpers');
var comparison = helpers.comparison();
var router = express.Router();
router.use(methodOverride("_method"));
var db = require('./../models');

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

module.exports = router;
