var application = sails.config.globals;

var QuizController = {

	show: function(req, res) {
		
		application.title = 'Quiz';
		res.view('speaker/quiz/show');
	},

};

module.exports = QuizController;