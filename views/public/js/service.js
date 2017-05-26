$(document).ready(function(){
	var checkoutCart = [];
	var currentUser = $('#currentUser').val();

	$(document).on('click', '#addCart', function(){
		var newProduct = $('#product-select').val().trim();
		newProduct = newProduct.split('*');
		var amountToSell = $('#amountToSell').val().trim();
		var productObj = {};
		productObj.product = newProduct[0];
		productObj.currentAmount = newProduct[1];
		productObj.price = newProduct[2].replace('$', "");
		productObj.amount = amountToSell;
		checkoutCart.push(productObj);
		$('#product-select').val('');
		$('#amountToSell').val('');
		var div = $('<div class="row text-center">');
		var divCol1 = $('<div class="col-sm-6">');
		var divCol2 = $('<div class="col-sm-6">');
		divCol1.html(productObj.amount + ' ' + productObj.product);
		divCol2.html("$" + productObj.price);
		div.append(divCol1);
		div.append(divCol2);
		$('#transactionDiv').append(div);
		var totalPrice = 0;
		for(var i = 0; i < checkoutCart.length; i++){
			console.log(totalPrice);
			console.log(checkoutCart[i].price);
			console.log(checkoutCart[i].amount);
			totalPrice += (parseInt(checkoutCart[i].price) * parseInt(checkoutCart[i].amount));
			console.log(totalPrice);
		}
		$('#totalPrice').text(totalPrice);
		
	});
	
	$(document).on('click', '#finalBuy', function(event){
		var customerMoney = parseInt($('#customerMoney').val().trim());
		var moneyToPay = parseInt($('#totalPrice').text());
		if(customerMoney < moneyToPay){
			alert('Not Enough Money.');
		}
		else if(customerMoney > moneyToPay || customerMoney === moneyToPay){
			$.post('/user/' + currentUser + '/service', {checkoutCart: checkoutCart}).done(function(data){
			if(data){
				alert('Transaction Successful!');
			}
			var moneyDiff = (customerMoney - moneyToPay);
			var h4 = $('<h4>');
			h4.text("Change: $" + moneyDiff);
			$('#change').html(h4);
		})
		}

	});

})