var express = require('express');
var methodOverride = require('method-override');
var helpers = require('handlebars-helpers');
var comparison = helpers.comparison();
var router = express.Router();
router.use(methodOverride("_method"));
var db = require('./../models');

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

router.post('/user/:username/service', function(req, res){
	db.User.findOne({
		where: {
			username: req.params.username
		}
	}).then(function(data){
		var UserId = data.dataValues.id;
		var results = req.body.checkoutCart;
		for(var i = 0; i < results.length; i++){
			var currentAmount = parseInt(results[i].currentAmount);
			var amount = parseInt(results[i].amount);
			var newAmount = currentAmount - amount;
			db.Product.update({
				quantity: newAmount
			},
			{
				where: {
					name: results[i].product,
					UserId: UserId
				}
			}).then(function(data){
			});
		}
		res.end();
	});
});

module.exports = router;