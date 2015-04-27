var application = sails.config.globals;

var DoubtsApiController = {
   
   /*
    */
   index: function(req, res) {
      return res.json({status: '200'});
   },
};

module.exports = DoubtsApiController;

