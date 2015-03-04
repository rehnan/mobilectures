var application = sails.config.globals;

var ListenersController = {

	show: function(req, res) {
		application.title = 'Listeners';
		res.view('speaker/listeners/show');
	},

};

module.exports = ListenersController;