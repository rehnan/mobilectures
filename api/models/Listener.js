/**
* Listeners.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {

    name : { 
        type: 'string',
        required: true 
    },

    email : { 
        type: 'string',
        required: true 
    },

    password : { 
        type: 'string',
        required: true 
    },

    logged_room : { 
        type: 'string',
        defaultsTo: null 
    },

    participants: {
           collection:'session', //Referente ao modelo Session
           via: 'listeners'
    }
  }
};

