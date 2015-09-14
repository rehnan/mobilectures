module.exports = {

   active_link: function (path, url) {
      var str = url.toString();
      var rg = new RegExp("^"+path+"$");

      return (str.match(rg)) ? 'active' : '';
   },

   status:  function($boolean) {
      return ($boolean) ? sails.__('global.status.active') : sails.__('global.status.inactive');
   },
   bool:  function($boolean) {
      return ($boolean) ? sails.__('global.boolean.true') : sails.__('global.boolean.false');
   },

   disableUnless: function($bollean) {
      return ($bollean) ? '' : "disabled='disabled'";
   },

   checked: function($actual, expected) {
      return ($actual == expected) ? 'checked' : '';
   },

   change_class_row: function($bollean) {
      return ($bollean) ? 'success' : 'warning';
   },

   change_class_btn: function($bollean) {
      return ($bollean) ? 'btn-success' : 'btn-warning';
   },

   change_class_label: function($bollean) {
      return ($bollean) ? 'Respondida <span class="glyphicon glyphicon-check"></span>' : 'Responder <span class="glyphicon glyphicon-question-sign"></span>';
   },

   show_initial_chars: function(start, end, string) {
      var str = string.trim();
      return str.substring(start, end)+'...';
   },

   link_action: function (link_to, icon, title, data_confirm, add_class) {
      if(data_confirm){
         return '<a href="'+link_to+'" class="btn btn-default '+add_class+'" title="'+title+'" data-confirm="'+data_confirm+'" rule="button" ><span class="glyphicon glyphicon-'+icon+'" aria-hidden="true"></span></a>';
      }
      return '<a href="'+link_to+'" class="btn btn-default" title="'+title+'" rule="button"><span class="glyphicon glyphicon-'+icon+'" aria-hidden="true"></span></a>';
   },

   modal_preview: function(poll_id, _class) {
      var c = (_class) ? _class : '';
      return '<a type="button" class="btn btn-default '+c+'" rule="button" data-toggle="modal" title="Preview" data-target="#modal-'+ poll_id +'"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
   },

   /*
   *Retorna o número de dúvidas de uma sessão
   
   doubt_count: function(params){
      //Log.error(JSON.stringify(params));
      return 40;
      
      Session.findOne(params).populate('doubts').exec(function (err, session){
         if(err){return err;}
         Log.error(JSON.stringify(session.doubts.length));
         return session.doubts.length;
      });
   }

   in View
   <%= ViewHelpers.doubt_count(condition = {id:session.id, owner:req.session.passport.user.id}) %>
   */
}
