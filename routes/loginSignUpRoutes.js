var express = require('express');
var methodOverride = require('method-override');
var helpers = require('handlebars-helpers');
var comparison = helpers.comparison();
var router = express.Router();
router.use(methodOverride("_method"));
var db = require('./../models');

// renders login page
router.get('/', function(req, res){
	res.render('login');
});
// Login authentication route
router.post('/', function(req, res){
	// Goes inside database and looks for the user
	db.User.findOne({
		where: {
			username: req.body.userName
		}
	}).then(function(data){
		// Stores username and password values
		var userName = data.dataValues.username;
		var password = data.dataValues.password;
		// if the password the user provided
		// matches the password inside the database
		if(password === req.body.password){
			// then redirect the user to their account
			res.redirect('/user/' + userName);
		}
		else{
			// else, tell the user the username/password is invalid
			res.send('<h1>Sorry Invalid username or password!</h1>');
		}
		// Catches an error just in case 
		// tells the user Invalid username/password
	}).catch(function(err){
		res.status(400).send('<h1>Sorry, Invalid username or password!</h1>');
	});
});

// Renders the signUp page
router.get('/signUp', function(req, res){
	res.render('signUp');
});

// Route for Creating a new account
router.post('/signUp', function(req, res){
	// Stores input values
	var name = req.body.name;
	var userName = req.body.userNameSign;
	var password = req.body.passwordSign;
	var passwordConfirm = req.body.passwordConfirm;
	// Checks if the username is already taken
	db.User.findOne({
		where: {
			username: userName
		}
	}).then(function(data){
		if(data){
			// tells the user the username is taken
			res.send('<h1>Username Already taken!</h1>');
		}
		else{
			// checks if the password match
			if(passwordConfirm !== password){
				res.send("<h1>Passwords do not match!</h1>");
			}
			// if passwords match and username isnt taken
			else if(passwordConfirm === password){
				// Create the user in the database
				db.User.create({
					name: name,
					username: userName,
					password: password
				}).then(function(data){
					res.redirect('/');
				});
			}
		}
	});	
});

module.exports = router;
