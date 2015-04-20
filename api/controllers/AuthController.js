/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var application = sails.config.globals;
var passport = require('passport');

module.exports = {

  /**
   * `AuthController.login()`
   */
  root: function(req, res) {
    res.redirect('login');
  },

  /**
   * `AuthController.login()`
   */
  index: function (req, res) {
     application.title = req.__('speaker.login.title');

     if (req.session.passport.user) {
        return res.redirect('/speaker');
     }

     return res.view({layout: 'layouts/login',
                     locals:{errors:{}, speaker: SpeakerAccount.new}});
  },

  /**
   * `AuthController.signin()`
   */
  signin: function (req, res) {
     application.title = req.__('speaker.login.title');

     passport.authenticate('local', function(err, user, info) {
        // Se houver erro renderiza a view login com a mensagem de erro
        if(err) {
           sails.log.error('Login: ' + JSON.stringify(req.params.all()) + JSON.stringify(info));
           return res.view('auth/index', {layout: 'layouts/login'});
        }

        //Se houver usuário inexistente renderiza a view login com a mensagem de erro
        if (!user) {
           sails.log.error('Login: ' + JSON.stringify(req.params.all()) + JSON.stringify(info));
           req.flash('error', req.__('global.login.error'));
           return res.view('auth/index', {layout: 'layouts/login'});
        }

        req.logIn(user, function(err) {
           sails.log.info('Login: ' + JSON.stringify(req.params.all()) + " Logged in");
           if (err) {
              return res.view('auth/index', {layout: 'layouts/login'});
           }
           req.flash('success', req.__('global.login.success'));
           return res.redirect('/speaker');
        });
     })(req, res);
  },

  /**
   * `AuthController.signup()`
   */
  signup: function (req, res) {
     application.title = req.__('speaker.sign_up.title');

     // Verifica se há algum usuário logado para o redirecionamento correto
     if (req.session.passport.user) {
        return res.redirect('/speaker');
     }

     return res.view({layout: 'layouts/login',
                     errors: {}, speaker: SpeakerAccount.new});
  },


  /**
   * `AuthController.create()`
   */
  create: function (req, res) {
     SpeakerAccount.createIfValid(req.params.all(), function (errors, record) {
        if (errors) {
           sails.log.debug('Error ==> ' + JSON.stringify(errors));
           return res.view('auth/signup', {layout: 'layouts/login',
                           locals: {errors: errors,  speaker: req.params.all()}});
        } else {
           req.login(record, function(err) {
              if (err) { return next(err); }

              sails.log.debug('Sessão criada! Redirecionando para Speaker Area');
              return res.redirect('/speaker');
           });
        }
     });
  },

  /**
   * `AuthController.logout()`
   */
  logout: function (req, res) {
     req.session.destroy(function(err) { /* cannot access session here */ });
     return res.redirect('/login');
  }
};

