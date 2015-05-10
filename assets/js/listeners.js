$(document).ready(function (){  ml.listeners.load() });

ml.listeners = {

   load: function () {
    ml.listeners.createTableListeners();
    ml.listeners.subscribeAndListen();
 },

 createTableListeners: function () {
   var url = '/api/sessions/' + $('#listeners').data('session_id')  +  '/listeners/';

   $('#table-listeners').bootstrapTable({
      method: 'GET',
      url: url,
      cache: false,
      height: 400,
      striped: true,
      search: true,
      showColumns: true,
      showRefresh: true,
      minimumCountColumns: 2,
      clickToSelect: true,
      responseHandler: function (res) {
            // Recuperando chave de sessão empilhada na resposta de requisição
            // console.log(res);
            return res;
         },
         columns: [{
            field: 'avatar',
            title: 'Avatar',
            align: 'center',
            valign: 'middle',
            formatter: ml.listeners.showAvatarImage,
            clickToSelect: false,
         }, {
            field: 'name',
            title: 'Nome',
            align: 'center',
            valign: 'middle',
            sortable: true,
         }, {
            field: 'email',
            title: 'Email',
            align: 'center',
            valign: 'middle',
            sortable: true,
         }, {
            field: 'id',
            title: 'ID',
            align: 'center',
            valign: 'middle',
            sortable: true
         }, {
            field: 'logged_room',
            title: 'Status',
            align: 'center',
            valign: 'middle',
            formatter: ml.listeners.listenerJoinOrLeave,
            clickToSelect: false,
         }]
      });  
}, 

   // Método para mudar a imagem de usuário online/offline de acordo com seu status
   listenerJoinOrLeave: function statusChange(value, row) {
      console.log('Statuts change: ')
      console.log(value);
      console.log(row);
      var status = (row !== null && row.logged_room === $('#listeners').data('session_id')) ? 'Online' : 'Offline'
      return status;
   },

   showAvatarImage: function showAvatar(value, row) {
         var class_status = (row !== null && row.logged_room === $('#listeners').data('session_id')) ? 'circle_on' : 'circle_off'
         var img_avatar = "<div class='circle-mask'><img align='middle' src='"+value+"' alt='Smiley face' class='"+class_status+"' width='56' height='56'></image></div>";
         return img_avatar;
   },

   subscribeAndListen: function () {
      if ($('#table-listeners').length <= 0) {return;}
      var session_id = $('#session-open').attr('data-session_id');

      url = '/speaker/sessions/'+session_id+'/listeners/subscribe';
      io.socket.post(url, function (data){
         console.log('Subscribe Listeners');
         console.log(data);
      });

      io.socket.on('listener',function(obj){
         console.log('Listener in/out');
         console.log(obj);
         $('#table-listeners').bootstrapTable('refresh');
      });
   }

}
