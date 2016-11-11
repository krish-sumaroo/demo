//objects
var globalScope, paymentObj, productObj, supplierObj, history;
var supplierObj = {id:false};
var historySupplier;
var tempTransac;
var VATRate = 15;

var icons = {
    change : 'glyphicon glyphicon-map-marker blue',
    promo : 'fa fa-gift',
    error : 'glyphicon glyphicon-flash red',
    ok : 'glyphicon glyphicon-ok-sign green'
};



var UIActions = {
disableProduct : function(element){
        $('#click'+element.id).addClass('animated zoomOutRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $('#click'+element.id).removeClass('animated zoomOutRight').hide();
    });

    },
    enableProduct : function(element){
        $('#click'+element).show().addClass('animated zoomInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $('#click'+element).removeClass('animated zoomInLeft');
       });
    },
    createRow : function(obj, tran, data, icon){
        var transacIcon = icons[icon];
        var action = '<button type="button" class="btn btn-danger btn-xs shiny icon-only white tooltip-danger removeCol" data-toggle="tooltip" data-original-title="Delete"><i class="fa fa-times"></i></button>';
        var subtotal_disp = data.prod_subtotal.toFixed(2);
        var total_disp = data.prod_total.toFixed(2);
        var vat_disp = data.prod_vat.toFixed(2);
        var html = ["<tr data-product='",obj.id,"' id='row_",obj.id,"' data-type='",icon,"' >",
                    "<td><i class='",transacIcon,"'></i></td>",
                    "<td>",obj.name,"</td>",
                    "<td>",tran.qty,"</td>",
                    "<td class='row-subtotal'>",subtotal_disp,"</td>",
                    "<td class='row-vat'>",vat_disp,"</td>",
                    "<td>",total_disp,"</td>",
                    "<td>",action,"</td>",
                    "</tr>"].join('');

    	$('#trBody').append(html);
    },
    removeRow : function(element){
        $('#row_'+element).remove();
    },
    clearForm : function(){
        $('#product_name_text').html('');
        $('#product_size').html('');
        $('#product_cost').html('');
        $('#product_selling').html('');
        $('#product_vat').html('');
        $('#product_margin').html('');        
        $('#transac_qty').val('');
        $('#transac_total').val('');
    },
    clearPayment : function(){
        $('#payment_supplier_name').html('');
        $('#paymentAmountDisplay').html('');
        $('#pur_cheque_list').val('');
        $('#pur_cheque_date').val('');
        $('#pur_date_due').val('');
    },
    clearHistory : function(){
        $('#trBody').html('');
    },
    clearSupplier : function(){
        $('#supplier-modal-msg').html('');
        $('#saveSupplier_save').button('reset');
        $('#supplierForm')[0].reset();
    },
    initialiseObj : function(){
        paymentObj = {};
        paymentObj.method = 1;
        globalScope = {vatIncluded:false, subtotal : 0, vat:0, total : 0, transaction : 0};
        priceMovement = false;
        productObj = {};
    },
    updateBalance : function(){
        //round all currency to 2 d.p
        globalScope.subtotal = utils.roundTo2DP(globalScope.subtotal);
        globalScope.total = utils.roundTo2DP(globalScope.total);
        globalScope.vat = utils.roundTo2DP(globalScope.vat);

        $('#subTotal').html(globalScope.subtotal.toFixed(2));
        $('#vatTotal').html(globalScope.vat.toFixed(2));
        $('#totTotal').html(globalScope.total.toFixed(2));
        this.enablePaymentBtn();
    },
    priceChange : function(prod, priceChange){
        //populate the priceChangeForm
        $('#priceChange_prodName').html(prod.name);
        $('#oldPrice').html(prod.cost);
        $('#newPrice').html(priceChange.newCP.toFixed(2));

        $('#priceChange').modal('show');

        if(priceChange.priceMov == 'increase') {
            priceMovement = {movement:'inc',type:'change', info:null};
            $('#priceDecPanel').hide();
            $('#priceIncPanel').show();
        } else {
            priceMovement = {movement:'dec',type:'change', info:null};
            $('#priceIncPanel').hide();
            $('#priceDecPanel').show();
        }

        priceMovement.cp = priceChange.newCP;
    },
    transacComplete : function(prodObj, transaction){
        transactionViews.switchView('blank','pulse');
        this.disableProduct(prodObj);       
        this.clearForm();
        productService.saveRow(prodObj, transaction);
    },
    enableTransacBtn : function(){
        if(($('#datePur').val() == '') || ($('#supplier').val() == '')){
            $('#loadTransac').prop('disabled', true);
        } else {
            $('#loadTransac').prop('disabled', false);
        }
    },
    enablePaymentBtn : function(){
        if(globalScope.total > 0 ){
            $('#loadPayment').prop('disabled', false);
        } else {
            $('#loadPayment').prop('disabled', true);
        }
    },
    showPartialSave : function(){
        if(globalScope.total > 0){
            Notify('Partial purchases : ' + supplierObj.name+' saved', 'top-right', '5000', 'magenta', 'fa-thumbs-o-up', true);
        }
    }
};

var priceChangeModule = {
    priceInc_error_view : function(ele){
        priceMovement.type = 'error';
        this.initialisePanel(ele, 'priceInc');
        $('#priceInc_error_view').show();
    },
    initialiseModal : function(){
        $('#priceChange_frm')[0].reset();
        $('#priceInc_buttons_container > .btn').removeClass('btn-sky');
        $('#priceDec_buttons_container > .btn').removeClass('btn-sky');
        $('#priceDecAction_dec').addClass('btn-sky');
        $('#priceIncAction_dec').addClass('btn-sky');
        priceMovement = false;
    },
}

var UIControllers = {
	loadFromBasket : function(obj){
		$('#product_name_text').html(obj.name);
		$('#product_size').html(obj.size);
		$('#product_cost').html(obj.cost);
		$('#product_selling').html(obj.selling);
        $('#product_margin').html(calcul.margin(obj));
        $('#transac_qty').val('');
        $('#transac_total').val('');

		var vatable = obj.vatable == '1' ? 'VAT' : 'NON-VAT';
		$('#product_vat').html(vatable);
	},
	addToComplete : function(obj,tran,serverData,icon){		
		UIActions.createRow(obj, tran,serverData,icon);

        //add attributes
         $('#row_'+obj.id).attr('data-transac', serverData.productRow);
		UIActions.disableProduct($('#click'+obj.id));
	}
};

var productService = {
    saveRow : function(obj, tran){
        var transac = globalScope.transaction;
        var priceChange_post = false;
        var transacIcon = 'ok';

        if(priceMovement)
        {
            priceChange_post = JSON.stringify(priceMovement);
            transacIcon = priceMovement.type;
        }



        $.post(root_url+'purchase/row', {'total':tran.total,
                'qty' : tran.qty,
                'prod' : obj.id,
                'date' : $('#datePur').val(),
                'transac' : transac,
                'vatIncluded' : $("#vatInc").is(':checked'),
                'priceChange' : priceChange_post,
                'new' : JSON.stringify(tran.newProduct)
            },
            function(data){
                //set the id returned to the main element
                globalScope.transaction = data.purchase;

                UIControllers.addToComplete(obj,tran,data, transacIcon);

                //update balance
                globalScope.subtotal = parseFloat(data.subtotal);
                globalScope.vat = parseFloat(data.vat);
                globalScope.total = globalScope.subtotal + globalScope.vat;
                UIActions.updateBalance();
            },'json');

    },
    deleteRow : function(transac, type){
        $.post(root_url+'purchase/deleteRow', {'objId' : transac, 'type' : type}, function(data){

        });
    },
    savePayment : function(options){
        $.post(root_url+'purchase/payment', options, function(data){
            if(data.status == 1){
                console.log('done saving payment');

                //load notification
                navigatorPanel.showPanel('supplierPanel');
                Notify(supplierObj.name+' saved', 'top-right', '5000', 'magenta', 'fa-thumbs-o-up', true);
            }
        });
    },
    getBankInfo : function(){
        $.get(root_url+'bank/infoCheque', function(data){
            $('#pur_bank_list').html(data.view);
        });
    },
    loadProducts : function(){
        $.get(root_url+'products/listClickable/'+supplierObj.id, function(data){
          if(data.status)
          {
            $('#productList').html(data.view);
            navigatorPanel.showPanel('transactionPanel');
            transactionViews.switchView('blank','pulse');
            $('#transac_load_modal').modal('hide');
          }
          else{
            //display errors
            $('#productList').html("Error finding products !!!");
          }
         },'json');
    }

}

