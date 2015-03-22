// flash.js policy
module.exports = function(req, res, next) {
  sails.log.debug('INICIALIZANDO ARRAY SESSION FLASH MESSAGES');
  res.locals.messages = { success: [], error: [], warning: [],  info: [] };

  if(!req.session.messages) {
    req.session.messages = { success: [], error: [], warning: [], info: [] };
    return next();
  }
  res.locals.messages = _.clone(req.session.messages);

  // Clear flash
  req.session.messages = { success: [], error: [], warning: [], info: [] };
  return next();
};