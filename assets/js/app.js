$(document).ready(function() {
	var socket = io.connect('http://localhost:1337');

	socket.on("connect", function () {
   	 console.log("Connected!");
	});
});