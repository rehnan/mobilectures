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
	application.title = req.__('start_page');
	//sails.log.debug('User: '+req.session.passport.user);
    return res.view('speaker/index');
  },

  show: function(req, res) {
  	application.title = req.__('title_edit_account');

  	SpeakerAccount.findOne({id:req.param('id')}).exec(function findSpeakerAccount(error, speaker){
  		if(error){sails.log.debug(error);}
  		if(!speaker){sails.log.debug('SpekarAccount not found to update');}

  		return res.view('speaker/edit', {locals:{speaker:speaker, errors: {}}});
  	});
  },

  update: function(req, res) {
  		sails.log.debug(req.params.all());
	  	SpeakerAccount.validate(req.params.all(), function validadeAccount(err){
	  		if(err){
		  		sails.log.debug('Error Validation!!!');
	            errors_messages = SailsValidador(SpeakerAccount, err);
	            sails.log.debug('Error ==> ' + JSON.stringify(errors_messages));
	            return res.view('speaker/edit', {locals:{speaker:req.params.all(), errors: errors_messages}});
	        }else{
	        	SpeakerAccount.update({id:req.session.passport.user}, req.params.all()).exec(function updateSpekarAccount(err, speakerUpdated){
	        		return res.redirect('speaker/show/'+speakerUpdated[0].id);
	        	});
		  	}
		  	
	  	});
  }
};

