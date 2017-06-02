$(document).ready(function(){
	var checkoutCart = [];
	// stores current username
	var currentUser = $('#currentUser').val();

	// click event for add to cart button
	$(document).on('click', '#addCart', function(){
		$('#message').text('');
		// stores current product
		var newProduct = $('#product-select').val().trim();
		// seperates name, stock quantity, and price of product
		newProduct = newProduct.split('*');
		// stores amount to sell
		var amountToSell = $('#amountToSell').val().trim();
		var productObj = {};
		// stores seperated values in the product object
		productObj.product = newProduct[0];
		productObj.currentAmount = newProduct[1];
		productObj.price = parseFloat(newProduct[2].replace('$', ""));
		productObj.amount = parseFloat(amountToSell);
		// if the amount to sell is greater than the current amount of the product
		//then tell the user, insufficient stock quantity
		if(productObj.amount > productObj.currentAmount){
			$('#message').text('Insufficient stock quantity');
			$('#amountToSell').val('');
		}
		// else display the product on the modal
		else if(productObj.amount == productObj.currentAmount || productObj.amount < productObj.currentAmount){
			checkoutCart.push(productObj);
			$('#product-select').val('');
			$('#amountToSell').val('');
			var div = $('<div class="row text-center">');
			var divCol1 = $('<div class="col-xs-6">');
			var divCol2 = $('<div class="col-xs-6">');
			divCol1.html(productObj.amount + ' ' + productObj.product);
			divCol2.html("$" + productObj.price);
			div.append(divCol1);
			div.append(divCol2);
			$('#transactionDiv').append(div);
			var totalPrice = 0;
			// adds up the total price of all the products
			for(var i = 0; i < checkoutCart.length; i++){
				totalPrice += checkoutCart[i].price * checkoutCart[i].amount;
			}
			// display total price
			$('#totalPrice').text(totalPrice);
		}
	});
	
	// Click even for finalizing the transaction
	$(document).on('click', '#finalBuy', function(event){
		// Stores the customer money and money to pay
		var customerMoney = parseFloat($('#customerMoney').val().trim());
		var moneyToPay = parseFloat($('#totalPrice').text());
		// if the customer money is less than the amount to pay
		//alert not enough money
		if(customerMoney < moneyToPay){
			alert('Not Enough Money.');
		}
		// else, complete the transaction 
		else if(customerMoney > moneyToPay || customerMoney === moneyToPay){
			$.post('/user/' + currentUser + '/service', {checkoutCart: checkoutCart}).done(function(data){
				var moneyDiff =Math.round(100 * (customerMoney - moneyToPay))/100;
				var h4 = $('<h4>');
				h4.text("Change: $" + moneyDiff);
				$('#change').html(h4);
				checkoutCart = [];
				$('#transactionDiv').html('');

			});
		}
	});
	//Reloads the page after the transaction is complete
	$(document).on('hidden.bs.modal', '#trans-modal', function(e){
		location.reload();
	});

	$(document).on('click', '#loginBtn', function(){
		var loginInfo = {
			userName: $('#userName').val().trim(),
			password: $('#password').val().trim()
		}
		$.post('/', loginInfo).done(function(response){
			if(response === 'Invalid username or password.'){
				$('#loginMessage').text(response);
				$('#loginMessage').addClass('animated flash');
			}
			else{
				 window.location.href = "/user/" + response;
			}
		})
	})

	//Sends info to the server, checking if the account can be created
	//depending on whether the username is taken and whether the passwords match
	$('#signUpBtn').click(function(){
		var signUpInfo = {
			name: $('#name').val().trim(),
			userNameSign: $('#userNameSign').val().trim(),
			passwordSign: $('#passwordSign').val().trim(),
			passwordConfirm: $('#passwordConfirm').val().trim()
		};
		// if a response is recieved, then display the response
		$.post('/signUp', signUpInfo).done(function(response){
			if(response === 'Username taken, choose a different one.'){
				$('#userNameSignMessage').text(response);
				$('#userNameSignMessage').addClass('animated flash');	
			}
			else if(response === "Passwords do not match."){
				$('#confirmPasswordMessage').text(response);
				$('#confirmPasswordMessage').addClass('animated flash')
			}
			else{
				 window.location.href = "/";
			}
		});
	})
});