var application = sails.config.globals;

var QuizController = {

	show: function(req, res) {
		
		application.title = req.__('option_quizes');
		res.view('speaker/quiz/show', {layout: 'layout_options'});
	},

};

module.exports = QuizController;