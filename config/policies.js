/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

   /***************************************************************************
    *                                                                          *
    * Default policy for all controllers and actions (`true` allows public     *
    * access)                                                                  *
    *                                                                          *
    ***************************************************************************/
   '*' : 'localize' ,
   '*':  'flash', //Disponibilzando o uso do flash para todos os controllers
   // '*': true,
   //Política de autenticação inclusa em /policies/isAuthenticated
   '*': 'isAuthenticated',

   //Lista branca das ações do controller AuthController
   'auth': {
      '*': true
   },

   /* ################# API POLICES ####################### */
   'api/authApi': {
      '*': true
   },
   'api/doubts': {
      '*': true
   },
   /* ################# END API POLICES ####################### */

   //Lista branca das ações do controller AuthController
   listeners: {
      getAll: 'isAuthenticated', //Ação liberada apenas para requisiçõe HTTP autenticadas
      create: 'onlySocketReq', //Ação liberada apenas para requisiçõe sockets
      update: 'onlySocketReq', //Ação liberada apenas para requisiçõe sockets
      subscribe: 'onlySocketReq', //Ação liberada apenas para requisiçõe sockets
      destroy: 'onlySocketReq', //Ação liberada apenas para requisiçõe sockets
      join: 'onlySocketReq', //Ação liberada apenas para requisiçõe sockets
      leave: 'onlySocketReq', //Ação liberada apenas para requisiçõe sockets
      sendMessage: 'isAuthenticated',
      signin:'isAuthenticated',
      dashboard:'isAuthenticated',
      doubtReceived:'onlySocketReq'
   },

   /***************************************************************************
    *                                                                          *
    * Here's an example of mapping some policies to run before a controller    *
    * and its actions                                                          *
    *                                                                          *
    ***************************************************************************/
   // RabbitController: {

   // Apply the `false` policy as the default for all of RabbitController's actions
   // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
   // '*': false,

   // For the action `nurture`, apply the 'isRabbitMother' policy
   // (this overrides `false` above)
   // nurture	: 'isRabbitMother',

   // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
   // before letting any users feed our rabbits
   // feed : ['isNiceToAnimals', 'hasRabbitFood']
   // }
};
