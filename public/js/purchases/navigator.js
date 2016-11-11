var panels = ['supplier','transac','payment'];
var main_transac__view_enabled = 'blank';
var main_transac_views = {'blank' : 'blank_view', 'main' : 'mainTransac_view', 'newProduct' : 'newProductView_view'}


$(function() {

$('#loadTransac').click(function() {
	navigatorPanel.loadTransaction();	
});

$('#changeSupplier').click(function() {
	navigatorPanel.showPanel('supplierPanel');
	UIActions.showPartialSave();
});

$('#loadPayment').click(function() {
	navigatorPanel.loadPayment();
});

$('#gotoPurchases').click(function() {
	navigatorPanel.goBackToPurchases();
});


});

var transactionViews = {
	view_enabled : 'blank',
	switchView : function(view, effect){

		//flip out old view
		var old_view = main_transac_views[this.view_enabled];
		var new_view = main_transac_views[view];
		this.view_enabled = view;
		
		/*
		$('#'+old_view).addClass('animated flipOutY').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        	$('#'+old_view).removeClass('animated flipOutY').hide();

        	//after animation flip in new view
        	$('#'+new_view).addClass('animated flipInY').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        		$('#'+new_view).removeClass('animated flipInY').show();        	
       		});
       	});
		*/
			$('#'+old_view).hide();
			$('#'+new_view).show().addClass('animated '+effect).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        		$('#'+new_view).removeClass('animated '+effect);        	
       		});


		/*
		$('#'+new_view).addClass('animated flipInY').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        		$('#'+new_view).removeClass('animated flipInY').show();        	
       		});
		*/
		//$('#'+new_view).show();
	}
}



var navigatorPanel = {
		showPanel : function(panel){
			$('#supplierPanel, #loading, #transactionPanel, #paymentPanel').hide();
			$('#'+panel).show().addClass('animated bounceInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('#'+panel).removeClass('animated bounceInRight');
	});
		},
		loadTransaction : function(){
			$('#transac_load_modal').modal('show');

			//save history and reset all forms
			if(supplierObj.id)
			{
				//reset all
				UIActions.initialiseObj();
				UIActions.clearHistory();
        		UIActions.clearForm();
        		UIActions.clearPayment();
			}

			//set supplier instance
			supplierObj.id = $('#supplier').val();
			supplierObj.name =  $('#supplier').select2('data').text;

			$('#supplier_name_prodBox').html(supplierObj.name);
			var transacDate = $('#datePur').val();

			//check if transaction already exists
			$.get(root_url+'purchase/transac/'+transacDate+'/'+supplierObj.id, function(data){
				if(data.status){
					//load the results
					$('#transac_load_modal_body').show();
					$('#purchasesCount').append(data.count);
				} else {
					$('#transac_loading_title').html('Loading products for : '+supplierObj.name);
					productService.loadProducts();
				}
			});

			//get productList
			 
		},
		loadPayment : function(){
			$('#payment_supplier_name').html(supplierObj.name);
			$('#paymentAmountDisplay').html(globalScope.total.toFixed(2));
			$('#subTotal_payment').html(globalScope.subtotal.toFixed(2));
			$('#vat_payment').html(globalScope.vat.toFixed(2));
			$('#total_payment').html(globalScope.total.toFixed(2));
			navigatorPanel.showPanel('paymentPanel');
		},
		goBackToPurchases : function(){
			navigatorPanel.showPanel('transactionPanel');
		}
};

