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
           sails.log.error(user + ' ########### Login Error ########' + JSON.stringify(info));
           return res.view('auth/index', {layout: 'layouts/login'});
        }

        //Se houver usuário inexistente renderiza a view login com a mensagem de erro
        if (!user){
           sails.log.error(user + ' ########### User Error ########' + JSON.stringify(info));
           req.flash('error', req.__('global.login.error'));
           return res.view('auth/index', {layout: 'layouts/login'});
        }

        req.logIn(user, function(err) {
           sails.log.debug('########### Logged in ######## ' + user);
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
    application.title = req.__('title_signup');
    //Verifica se há algum usuário logado para o redirecionamento correto
        if (req.session.passport.user) {
            return res.redirect('/speaker');
        }
        return res.view({layout: 'layout_login', errors: {}, speaker: SpeakerAccount.new});
  },


  /**
   * `AuthController.create()`
   */
   create: function (req, res) {
      SpeakerAccount.validate(req.params.all(), function validadeAccount(errors){
          sails.log.debug('Error 1 ==> ' + JSON.stringify(errors));

          SpeakerAccount.findOne({email: req.param('email') }, function (unique_err, unique_user) {
             if (unique_err) {return next(unique_err);}
             
             if (unique_user) {
                if (errors == undefined) { 
                   errors = {"error":"E_VALIDATION","status":400,"summary":"1 attribute is invalid","model":"SpeakerAccount"}  
                }
                if (errors['invalidAttributes'] == undefined) { errors['invalidAttributes'] = {} }  
                if (errors['invalidAttributes']['email'] == undefined) {errors['invalidAttributes']['email'] = Array() }
                
                errors['invalidAttributes']['email'].push({"rule":"unique","message":"\"unique\" attribute should be unique: ''"});
 
                if (errors['ValidationError'] == undefined) { errors['ValidationError'] = errors['invalidAttributes'] };    
             }

             if (errors) {
                req.flash('error', "Existe dados incorretos no formulário!");
                errors_messages = SailsValidador(SpeakerAccount, errors);
                sails.log.debug('Error ==> ' + JSON.stringify(errors_messages));

                return res.view('auth/signup', {layout: 'layout_login', locals: {errors: errors_messages,  speaker: req.params.all()}});
             }

              SpeakerAccount.create(req.params.all(), function (errors, user) {
                 sails.log.debug('[Sucesso] Email '+user.email+' cadastrado com sucesso!!');
                 //Efetua autenticação e redireciona para speaker área
                 req.login(user, function(err) {
                    if (err) { return next(err); }

                    sails.log.debug('Sessão criada! Redirecionando para Speaker Area');
                    return res.redirect('/speaker');
                 });
              });
             
          });
      });



     /* var email = req.param('email');
      SpeakerAccount.findOne({email:email}, function (err, unique_user) {
         if(err){return next(err);}
 
         SpeakerAccount.create(req.params.all(), function (errors, user) {
          
          sails.log.debug('Error ==> ' + JSON.stringify(errors));

          if (unique_user) {
            errors['invalidAttributes'].push({'email': [{message: 'adsfasdf'}]});
          }

//Error ==> {"error":"E_VALIDATION","status":400,"summary":"1 attribute is invalid","model":"SpeakerAccount","invalidAttributes":{"name":[{"rule":"required","message":"\"required\" validation rule failed for input: ''"}]}}


          if (errors) {
             req.flash('error', "Existe dados incorretos no formulário!");
             errors_messages = SailsValidador(SpeakerAccount, errors);
             sails.log.debug('Error ==> ' + JSON.stringify(errors_messages));

             return res.view('auth/signup', {layout: 'layout_login', locals: {errors: errors_messages,  speaker: req.params.all()}});
          }

          sails.log.debug('[Sucesso] Email '+user.email+' cadastrado com sucesso!!');
             //Efetua autenticação e redireciona para speaker área
          req.login(user, function(err) {
             if (err) { return next(err); }

             sails.log.debug('Sessão criada! Redirecionando para Speaker Area');
             return res.redirect('/speaker');
          });
        });

      });*/
  },

  /**
   * `AuthController.logout()`
   */
  logout: function (req, res) {
        //req.logout();
        req.session.destroy(function(err){
           // cannot access session here
         });
       return res.redirect('/login');
  }
};

