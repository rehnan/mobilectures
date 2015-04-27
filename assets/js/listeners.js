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
            field: 'id',
            title: 'ID',
            align: 'center',
            valign: 'middle',
            sortable: true
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
            field: 'password',
            title: 'Senha',
            align: 'center',
            valign: 'middle',
            clickToSelect: false,
         }, {
            field: 'logged_room',
            title: 'Online',
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
      var status = (row !== null && row.logged_room === $('#listeners').data('session_id')) ? '<img src="/images/icon_user_online.gif" class="img-responsive" alt="Listener online">' : '<img src="/images/icon_user_offline.gif" class="img-responsive" alt="Listener offline">'
      return status;
   },

   subscribeAndListen: function () {
      if ($('#table-listeners').length <= 0) {return;}

      url = '/speaker/listeners/subscribe';
      io.socket.get(url, function (data){
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
