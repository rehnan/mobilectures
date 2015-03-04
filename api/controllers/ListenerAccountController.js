
var ListenerAccountController = {

	index: function(req, res) {
		var socket = req.socket;
   	    var io = sails.io;


        
        //sails.log.debug(sails.io.sockets.clients());
        socket.get('/listeners/hello', function(data) {
           sails.log.debug(data.message);
		});
   	    //sails.log.debug(sails.io.sockets.clients());
   	    io.sockets.emit('messageName', {thisIs: 'theMessage'});
		return res.view('listeners/index', {layout: 'layout_listener'});
	},

	sayHello: function(req, res) {
		
		return res.json({"message": "Hello!"});
	}
};

module.exports = ListenerAccountController;