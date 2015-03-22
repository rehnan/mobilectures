var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;


//Método de serialização do usuário
passport.serializeUser(function(user, done) {
    //sails.log.debug('serialize User ID: '+user.email);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    //sails.log.debug('deserializeUser User ID: ');
    SpeakerAccount.findOne({id:id}, function (err, user) {
        done(err, user);
    });
});


//Método Passaport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },

    //Função Callback caso seja dado entrada do email e password do formulário
    function(email, password, done) {

      
        //Iniciar procura do usuário pelo método findOne
        SpeakerAccount.findOne({email: email}, function (err, user) {

            //Verifica se houve algum erro de banco na busca
          if (err) { 
            sails.log.error(err);
            return done(err); 
          }

          //Verifica se há alguma ocorrência na coleção de usuários procurado
          if (!user) {
            sails.log.error('Email inexistente!');
            return done(null, false, { message: 'Usuário/Senha inválido!' });
          }

          //Verifica se a senha do usuário encontrado é iguai a senha informada
          if (user.password != password) { 

            sails.log.error('Senha Incorreta!');
            return done(null, false, { message: 'Usuário/Senha inválido!' }); 
          }

          //sails.log.debug('End LocalStrategy');
          return done(null, user);
          
        });
    }
)); 




