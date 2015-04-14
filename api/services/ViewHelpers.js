module.exports = {
   active_link: function (path, url) {
      var str = url.toString();
      var rg = new RegExp(path);

      return (str.match(rg)) ? 'active' : '';
   }
}
