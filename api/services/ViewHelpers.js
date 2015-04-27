module.exports = {
   active_link: function (path, url) {
      var str = url.toString();
      var rg = new RegExp("^"+path+"$");

      return (str.match(rg)) ? 'active' : '';
   },
   status:  function($bollean) {
      return ($bollean) ? sails.__('global.status.active') : sails.__('global.status.inactive');
   },

   disableUnless: function($bollean) {
      return ($bollean) ? '' : "disabled='disabled'";
   },

   checked: function($actual, expected) {
      return ($actual == expected) ? 'checked' : '';
   }
}
