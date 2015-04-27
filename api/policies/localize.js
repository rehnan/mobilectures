module.exports = function(req, res, next) {
  req.setLocale(req.session.languagePreference);
  next();
};
