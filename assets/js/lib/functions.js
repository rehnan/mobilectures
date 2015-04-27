$(document).ready(function() {  ml.lib.load(); });

ml.lib = {

   load: function () {
     ml.lib.confirm_dialog();
   },

   /*** Confirm dialog **/
   confirm_dialog: function () {
      $('a[data-confirm]').on("click", function () {
         var msg = $(this).data('confirm');
         var link = $(this).attr('href');
         BootstrapDialog.confirm(msg, function(result){
            if(result) {
               return window.location = link;
            }
         });
         return false;
      });
   },
};
