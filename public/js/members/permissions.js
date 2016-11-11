$(function() {

$('.permissionSet').on('change', function () {
    
       $.post(root_url+'members/permission', {'ref':$(this).data('ref'),
       										  'state':$(this).prop('checked'),
       										  'permission' : $(this).data('ac')
       										}, function(data){

       							//show notifications				

        },'json');
	
		

});



});