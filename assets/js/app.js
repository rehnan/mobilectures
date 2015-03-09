$(document).ready(function() {

   //socket = socket || io.connect();
   var socket = io.connect();
   socket.on("connect", function () {
	   	console.log('Connected');
   });

   var key = "1234";
   var url = '/listeners/join';

   socket.get(url, {keySession:key}, function (response){
  		console.log(response.msg);
  	});
  
  /*
	$("#action_login").click(function() {
		//$('.form-signin').find('input[name="email"]').val();
		
	});
  */
});
