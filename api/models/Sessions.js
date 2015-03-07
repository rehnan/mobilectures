/**
* Sessions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
 //autosubscribe: ['destroy', 'update', 'add:users', 'remove:users'],
  attributes: {

  		name: {
  			type: 'string'
  		},

		key: {
			type: 'string'
		},

		status: {
			type: 'boolean',
			defaultsTo: false 
		}
		/*
		users: {
			collection: 'user',
			via: 'rooms'
		},
		*/
		//Uma sessão pertence à uma conta de palestrante 
		/*
		owner:{
            model:'speakeraccounts'
        }*/
  },
};

