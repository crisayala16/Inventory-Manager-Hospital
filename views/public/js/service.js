$(document).ready(function(){
	var checkoutCart = [];
	var currentUser = $('#currentUser').val();

	$(document).on('click', '#addCart', function(){
		var newProduct = $('.product-select').val().trim();
		newProduct = newProduct.split('*');
		var amountToSell = $('#amountToSell').val().trim();
		var productObj = {};
		productObj.product = newProduct[0];
		productObj.currentAmount = newProduct[1];
		productObj.price = newProduct[2];
		productObj.amount = amountToSell;
		checkoutCart.push(productObj);
		$('.product-select').val('');
		$('#amountToSell').val('');
		var div = $('<div class="row">');
		var divCol1 = $('<div class="col-md-6">');
		var divCol2 = $('<div class="col-md-6">');
		divCol1.html(productObj.product);
		divCol2.html(productObj.price);
		div.append(divCol1);
		div.append(divCol2);
		$('#transactionDiv').append(div);

	});
	// $(document).on('click', '#openModBtn', function(){
	// 	$('#trans-modal').modal('show');
	// })
	$(document).on('click', '#finalBuy', function(event){
		console.log(checkoutCart);
		$.post('/user/' + currentUser + '/service/checkout', {checkoutCart: checkoutCart}).done(function(data){
			console.log(data);
		})
	})
})