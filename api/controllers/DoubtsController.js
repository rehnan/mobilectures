var application = sails.config.globals;

var DoubtsController = {

	show: function(req, res) {
		application.title = 'Doubts';
		res.view('speaker/doubts/show');
	},

};

module.exports = DoubtsController;