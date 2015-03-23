/**
* SpeakerAccounts.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {
  	  name: {
          type: 'string',
          required: true
      },
	    
      email: {
          type: 'string',
          required: true,
          unique: true
      },
    
      password: {
          type: 'string',
          required: true
      },

      //Association with sessions (Uma conta de palestrante pode gerenciar várias sessões)
      //Possui uma coleção de sessões
      sessions:{
            collection: 'session', //do modelo Sessions
            via: 'owner' //via atributo owner (Localizado no modelo Sessions)
      }
  },

  toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
  },

  //Before save crypt the password attribute
   beforeCreate: function (attrs, next) {

      var bcrypt = require('bcrypt-nodejs');
      var salt = bcrypt.genSaltSync(10);

      // Hash the password with the salt
      attrs.password = bcrypt.hashSync(attrs.password, salt);

       next();
  },
  /*
beforeCreate: function (values, next) {

    // This checks to make sure the password and password confirmation match before creating record
    if (!values.password || values.password != values.confirmation) {
      return next({err: ["Password doesn't match password confirmation."]});
    }

    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }

  */


  validationMessages: {

    name: {
     required: 'você deve informar seu nome',
    },

    email: {
     required: 'você deve informar seu email',
     unique: 'Email já cadastrado!'
    },

    password: {
     required: 'você deve informar sua senha',
    }, 
  },

  new: {
    name: '',
    email: '',
    password: '',
  }


};

