$(document).ready(function(){
	var socket = io.connect();
	var name='';
	$('#chatbox').hide();

	$('#login_submit').click(function(){
		name= $('#login_name').val();
		if(name.length > 2){
			socket.emit('new_name', name);
			event.preventDefault();
			$('#login').hide();
		}
	})
	
	socket.on('show_chatbox', function(data){
		$('#chatbox').fadeIn();
	});

	socket.on('update_chatbox', function(data){
		console.log(data);
		$('#chat').html('');
		for(var i=0; i<data.length; i++){
			if(data[i].new_user){
				$('#chat').append("<div class='row'><div class='col-md-6 new_user'><p><span>" + data[i].new_user +"</span></p></div></div>");
			} else if(data[i].name && data[i].name == name){
				$('#chat').append("<div class='row'><div class='col-md-6 user pull-right'><p><span>"+ data[i].message + "</span></p></div></div>");
			} else if(data[i].name){
				$('#chat').append("<div class='row'><div class='col-md-6 other_user'><p><span><span class='user_name'>"+data[i].name + '</span>: ' + data[i].message + "</span></p></div></div>");
			} else {
				$('#chat').append("<div class='row'><div class='col-md-6 disconnecting'><p>" + data[i].disconnecting + "</p></div></div>");
			}
		}
		$('#chat').scrollTop(10000);
	});

	$('#submit').click(function(){
		event.preventDefault();
		console.log($('#message').val().length);
		if($('#message').val().length >= 1){
			socket.emit('add_message', {name: name, message: $('#message').val()});
			$('form')[0].reset();
			$('#message').val('');
		}
	});

});