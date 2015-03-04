/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  /**
   * `AuthController.login()`
   */
  index: function (req, res) {
    return res.view();
  },

  /**
   * `AuthController.signin()`
   */
  signin: function (req, res) {
    return res.json({
      todo: 'signin() is not implemented yet!'
    });
  },

  /**
   * `AuthController.signup()`
   */
  signup: function (req, res) {
    return res.view();
  },


  /**
   * `AuthController.create()`
   */
  create: function (req, res) {
        var email = req.param('email');
        //Verificar se há algum úsuário com o mesmo email

        SpeakerAccounts.findOne({email:email}, function (err, user) {
            if(err){return next(err);}

            if(!user){
                
                SpeakerAccounts.create(req.params.all(), function (err, user) {
                    if (err){return next(err);}
                    sails.log.debug('[Sucesso] Email '+user.email+' cadastrado com sucesso!!');
                    res.json({msg:'Usuário autenticado!!'});
                    /*
                    req.login(user, function(err) {
                        if (err) { return next(err); }
                         sails.log.debug('Sessão criada! Redirecionando para Speaker Area');
                        //return res.redirect('/login');
                        res.json({msg:'Usuário autenticado!!'});
                    });
                    */
                });
            }else{
                sails.log.debug('[erro] Email já existente!');
                //return res.redirect('/login');
                res.json({msg:'Usuário já existente!'});
            }
        });
  },


  /**
   * `AuthController.logout()`
   */
  logout: function (req, res) {
    return res.json({
      todo: 'logout() is not implemented yet!'
    });
  }
};

