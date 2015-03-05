/**
 * SpeakerController
 *
 * @description :: Server-side logic for managing Speakers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var application = sails.config.globals;
module.exports = {
	


  /**
   * `SpeakerController.index()`
   */
  index: function (req, res) {
  		application.title = 'Dashboard';
		//sails.log.debug('User: '+req.session.passport.user);
    return res.view('speaker/index');
  },
};

