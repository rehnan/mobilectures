var application = sails.config.globals;

var DoubtsApiController = {

   /*
   */
   index: function(req, res) {
   	return res.json({status: '200'});
   },

   create: function(req, res) {
   	var params = req.param('doubt');
   	params.listener = req.session.listener.id;
   	params.session = req.session.listener.logged_room;

   	Doubt.createIfValid(params, req, function (errors, record) {
   		if (errors) {
   			sails.log.debug('Error ==> ' + JSON.stringify(errors));
   			res.json([401], {errors: errors});
   		} else {
   			res.json([200], {doubt:record});
   		}
   	});
   }
};

module.exports = DoubtsApiController;

