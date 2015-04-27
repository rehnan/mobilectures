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
      application.title = req.__('speaker.profile.title');
      return res.view('speaker/index');
   },

   editProfile: function(req, res) {
      application.title = req.__('speaker.profile.title');

      var current_user = req.session.passport.user;
      return res.view('speaker/profile/update_profile', 
                      {locals: { speaker: current_user, errors: {} }});
   },

   editPassword: function(req, res){
      application.title = req.__('speaker.profile.title');
      var speaker = {
         current_password: '',
         new_password: '',
         confirm_password: ''
      };

      return res.view('speaker/profile/update_password',
                      {locals: {errors: {}, speaker: speaker}});
   },

   updateProfile: function(req, res) {
      sails.log.debug('Update' + JSON.stringify(req.session.passport.user) );

      var params = {
         name: req.param('name'),
         email: req.param('email'),
         user_id: req.session.passport.user.id
      };

      SpeakerAccount.updateIfValid(params, function (errors, record) {
         if (errors) {
            req.flash('error', req.__('global.flash.form.error'));
            return res.view('speaker/profile/update_profile', {locals: {errors: errors, speaker: req.params.all()}});
         } else {
            req.session.passport.user.name = record.name;
            req.session.passport.user.email = record.email;

            req.flash('info', req.__('global.flash.update.success'));
            return res.redirect('/speaker/' + req.session.passport.user.id + '/profile');
         }
      });
   },

   /*
    * Action to update speaker password
    */
   updatePassword: function(req, res) {
      var params = req.params.all();
      params.user_id = req.session.passport.user.id;

      SpeakerAccount.updatePassword(params, function (errors, record) {
         if (errors) {
            req.flash('error', req.__('global.flash.form.error'));
         } else {
            // clear form
            params.current_password = ''
            params.new_password = ''
            params.confirm_password = ''
            errors = {};
            req.flash('info', req.__('global.flash.update.success'));
         }
         return res.view('speaker/profile/update_password', { locals:{errors: errors, speaker: params}});
      });
   }
};

