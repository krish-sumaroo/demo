$(function() {


//toggle members
$('#membersContainer').on('change', '.memberFlag', function () {
        var ref = $(this).data('ref');
        var state = $(this).prop('checked');

     
       $.post(root_url+'members/toggle', {'ref':ref, 'state':state}, function(data){

        },'json');
});

$('.showPassBox').click(function() {
	var ref = $(this).data('ref');
	$('#chgPassB_'+ref).show();
});

$('.exitPassChg').click(function() {
	var ref = $(this).data('ref');
	clearPassBox(ref);
});

$('.savePassChg').click(function() {
	$(this).children().eq(1).text('Saving...')
	var $btnSave = $(this);
	var ref = $(this).data('ref');
	var pass = $('#passIn_'+ref).val();
	var passConf = $('#passInConf_'+ref).val();
	//validate pass
	if(pass === passConf){
		//do save
		$.post(root_url+'members/changePass', {'p':pass,'p1':passConf,'ref':ref}, function(data){
			console.log(data);
            if(data.status)
            {
           	  clearPassBox(ref);
           	  notifShow('success','Password changed');
           	  $btnSave.children().eq(1).text('Save');
            } else {
            	$.each(data.messages, function (index, msg) {
            		notifShow('error',data.messages);
			        console.log('message', msg);
			    })
			   $btnSave.children().eq(1).text('Save');
           }
            
        },'json');       
		
	} else {
		notifShow('error','Passwords do not match');
		$(this).children().eq(1).text('Save');
	}
});

});

function clearPassBox(ref)
{
	$('#chgPassB_'+ref).hide();
	$('#passIn_'+ref).val('');
	$('#passInConf_'+ref).val('');
}