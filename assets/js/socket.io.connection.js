 //Inserir IP do servidor
 //Produção
//var socket = io.connect('https://mobilectures.herokuapp.com');

 //Development
var socket = io.connect();

socket.on('error', function(){
    $(".connection-info").text("server not found");
});

socket.on('disconnect', function () {
    $(".connection-info").text("socket disconnected");
});

socket.on('reconnect', function () {
    $(".connection-info").text("socket reconnect");
});

socket.on('reconnecting', function () {
    $(".connection-info").text("socket reconnecting");
});

socket.on('reconnect_error', function () {
    $(".connection-info").text("socket reconnect_error");
});

socket.on('reconnect_failed', function () {
    $(".connection-info").text("socket reconnect_failed");
});