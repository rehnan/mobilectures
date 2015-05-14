var moment = require('moment');
moment.locale('pt');

module.exports = {
   formatDate: function(date) {
      return moment(date).format('DD/MM/YYYY HH:mm:ss');
   },

   fromNow: function(date) {
       return moment(date).fromNow();
   }
}