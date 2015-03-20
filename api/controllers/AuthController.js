/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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
      if (req.session.passport.user) {
              return res.redirect('/speaker');
      }
      return res.view({layout: 'layout_login',  locals:{speaker: SpeakerAccount.new}});
  },

  /**
   * `AuthController.signin()`
   */
  signin: function (req, res) {
        //sails.log.debug('Entrou na action signin');
        passport.authenticate('local', function(err, user, info)
        {
            //Se houver erro renderiza a view login com a mensagem de erro
            if(err){
              return res.view('auth/index', {layout: 'layout_login', locals: {message: info.message, speaker:req.params.all()}});
            }

            //Se houver usuário inexistente renderiza a view login com a mensagem de erro
            if (!user){
              sails.log.error(user+' ########### User Error ########'+JSON.stringify(info));
              info.message = (info.message === 'Missing credentials') ? 'Por favor, informe seu email e sua senha!' : info.message; 
              return res.view('auth/index', {layout: 'layout_login', locals: {message: info.message, speaker:req.params.all()}});
            }

            req.logIn(user, function(err) {
                  sails.log.debug('########### Login Efetuado ######## '+user);
                  if (err){
                      return res.view('auth/index', {layout: 'layout_login', locals: {message: info.message, speaker:req.params.all()}});
                  }
                  
                  return res.redirect('/speaker');
            });
        })(req, res);
    },
  

  /**
   * `AuthController.signup()`
   */
  signup: function (req, res) {
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
      
      //Efetua validação de campos válidos
      SpeakerAccount.validate(req.params.all(), function validadeAccount(errors){
          if(errors){
            errors_messages = SailsValidador(SpeakerAccount, errors);
            sails.log.debug('Error ==> ' + JSON.stringify(errors_messages));
            return res.view('auth/signup', {layout: 'layout_login', locals: {errors: errors_messages,  speaker: req.params.all()}});
          }else{
              var email = req.param('email');
              //Verificar se há algum úsuário com o mesmo email
              SpeakerAccount.findOne({email:email}, function (err, user) {
                  if(err){return next(err);}

                  if(!user){
                      //Cria cria nova conta
                      SpeakerAccount.create(req.params.all(), function (errors, user) {

                        if (err){
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
                  }else{
                      sails.log.error('[erro] Email já cadastrado!!');
                      return res.view('auth/signup', {layout: 'layout_login', locals: {message: "Este email já foi cadastrado!", errors: {}, speaker: req.params.all()}});
                  }

              });//End findOne Callback
          }//End Else validation
      });//Ende Validation function callback
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

