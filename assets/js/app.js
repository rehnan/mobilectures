$(document).ready(function() {
  createTableListeners();

  //Atualiza lista de ouvintes conectados
  function updateUsers(){
      $('#table-listeners').bootstrapTable('refresh');
  };

  //Método socket para logar
   $('#signin').click(function(){
      var em_user = $('#submit-signin').find('input[id="em_user"]').val();
      var pass_user = $('#submit-signin').find('input[id="pass_user"]').val();
      socket.get('/speaker/listeners/join', {email:em_user, password:pass_user}, function (data, jwres){
          //Enviar alguma resposta ao usuário    
      });
  });

  //Método socket para deslogar
  $('#signout').click(function(){
      var user_id = $('#submit-signout').find('input[id="user_id"]').val();
      socket.get('/speaker/listeners/leave/'+user_id, function (data, jwres){
        //Enviar alguma resposta ao usuário 
      });
  });

  //Método socket para criar usuário
  $('#createUser').click(function(){
      var name = $('#submit-create').find('input[id="name_user"]').val();
      var email = $('#submit-create').find('input[id="email_user"]').val();
      var password = $('#submit-create').find('input[id="password_user"]').val();

      socket.post('/speaker/listeners/create', {name:name, email:email, password:password}, function (data, jwres){
       //Enviar alguma resposta ao usuário 
      });
  });

  //Método socket update 
  $('#updateUser').click(function(){
      var id = $('#submit-update').find('input[id="id_user"]').val();
      var email = $('#submit-update').find('input[id="newname_user"]').val();
      socket.put('/speaker/listeners/update/'+id, {newName:email}, function (data, jwres){
      });
  });
  

   //socket = socket || io.connect();
   var socket = io.connect();
   socket.on("connect", function () {
              //updateUsers();
              url = '/speaker/listeners/subscribe';
              socket.get(url, function (data){
                  console.log(data.msg);
              });
              /*
              //Create new user from socket method
              socket.post('/user/create', {name:'Mariaaaa'}, function (data, jwres){
                console.log('Criado!');
             });

             //Updated user from socket method
             var id = '5500a0d592b1765d08108d27';
               socket.put('/user/update/'+id, {newName:'Sergio'}, function (data, jwres){
                console.log('Updated!');
             });



              urll = 'http://localhost:1337/user';
              socket.get(urll, function (data, listeners){
                
              });
            */
              //Messages feedback
              socket.on('listeners',function(obj){
                  if (obj.verb == 'created') {
                    //Evento de um novo listener criado
                    updateUsers();
                  }

                  if (obj.verb == 'updated') {
                      //Evento de um listener setado para online ou offline 
                      updateUsers();
                    }
               });
             
   });


  //Método para mudar a imagem de usuário online/offline de acordo com seu status
  function statusChange(value, row) {
        var status = value === true ? '<img src="/images/icon_user_online.gif" class="img-responsive" alt="Listener online">' : '<img src="/images/icon_user_offline.gif" class="img-responsive" alt="Listener offline">'

        return status;
    }

    //Gera a lista de ouvintes conectados
  function createTableListeners() {
      $('#table-listeners').bootstrapTable({
                    method: 'GET',
                    url: '/speaker/listeners/find',
                    cache: false,
                    height: 400,
                    striped: true,
                    search: true,
                    showColumns: true,
                    showRefresh: true,
                    minimumCountColumns: 2,
                    clickToSelect: true,
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
                        field: 'online',
                        title: 'Online',
                        align: 'center',
                        valign: 'middle',
                        formatter: statusChange,
                        clickToSelect: false,
                    }]
                });  
    }

});
