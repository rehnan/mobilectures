var application = sails.config.globals;

var PollsController = {

	show: function(req, res) {
		application.title = 'Polls';
		res.view('speaker/polls/show');
	},

};

module.exports = PollsController;