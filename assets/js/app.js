$(document).ready(function() {
  createTableListeners();

  //Abre modal para receber a senha de confirmação para atualização da conta
  $('.submit_profile_update').on('click', function() {
     
        BootstrapDialog.show({
            title: 'Informe sua senha de autenticação',
            message: $('<label for="input_pass_confirm">Senha:</label><div class="form-group input_pass_confirm"><input type="password" class="form-control" name="input_pass_confirm" id="input_pass_confirm" placeholder="Senha" autofocus><p><span class="help-block feedBackMessage"></span></p></div>'),
            buttons:[
              {
                  label: 'Cancelar',
                   action: function(dialogRef){
                   dialogRef.close();
                   }
              }, 
              {    label: 'Confirmar',
                    cssClass: 'btn-primary',
                    hotkey: 13, // Enter.
                    action: function() {
                      //Send password to compare
                     comparePassword($("#input_pass_confirm").val());
                     dialogRef.close();
                  }
            }]
        });

  });

  //Compara senha hash
  function comparePassword(password){
    $.post("/speaker/compare", {password: password}, function(data) {
      if(data.response === null){
         $(".input_pass_confirm").addClass("has-error has-feedback");
         $(".feedBackMessage").text("Por favor, informe a senha de autenticação");
      }else if(data.response){
          $("#form_update_profile").submit();
        }else{
          $(".input_pass_confirm").addClass("has-error has-feedback");
          $(".feedBackMessage").text("Senha incorreta!");
        }
        
    });
  };

  // client side
  $('#tab_edit_account a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  });

    $(".delete_session").on("click", function() {

    var link = $(this).attr('link');
    var session_name = $(this).attr('name');
    BootstrapDialog.confirm('Deseja excluir está sessão? ('+session_name+')', function(result){
            if(result) {
                return window.location = link;
            }
            return false;
        });
  });

  //Atualiza lista de ouvintes conectados
  function updateUsers(){
      $('#table-listeners').bootstrapTable('refresh');
  };

  //Method socket para logar
   $('#signin').click(function(){
      var key_session = $('#submit-signin').find('input[id="key_session"]').val();
      var em_user = $('#submit-signin').find('input[id="em_user"]').val();
      var pass_user = $('#submit-signin').find('input[id="pass_user"]').val();
      alert(key_session);
      socket.get('/speaker/listeners/join', {email:em_user, password:pass_user, keySession:key_session}, function (data, jwres){
          //Enviar alguma resposta ao usuário    
      });
  });

  //Method socket para deslogar
  $('#signout').click(function(){
      var session_key = $('#submit-signout').find('input[id="sessionKey"]').val();
      var user_id = $('#submit-signout').find('input[id="user_id"]').val();
      socket.post('/speaker/listeners/leave', {sessionkey:session_key, userId:user_id}, function (data, jwres){
        //Enviar alguma resposta ao usuário 
      });
  });

  //Method socket para criar usuário
  $('#createUser').click(function(){
      var name = $('#submit-create').find('input[id="name_user"]').val();
      var email = $('#submit-create').find('input[id="email_user"]').val();
      var password = $('#submit-create').find('input[id="password_user"]').val();

      socket.post('/speaker/listeners/create', {name:name, email:email, password:password}, function (data, jwres){
       //Enviar alguma resposta ao usuário 
      });
  });

  //Method socket update 
  $('#updateUser').click(function(){
      var id = $('#submit-update').find('input[id="id_user"]').val();
      var email = $('#submit-update').find('input[id="newname_user"]').val();
      socket.put('/speaker/listeners/update/'+id, {newName:email}, function (data, jwres){
      });
  });

    //Method to send doubts from socket to server
  $('#sendDoubt').click(function(){
      var doubt = $('#submit-doubt').find('input[id="doubt"]').val();
      alert(doubt);
      socket.post('/speaker/listeners/doubt', {doubt:doubt}, function (data, jwres){
      });
  }); 
  
   //Method to send message from server to client
  $('#sendMessage').click(function(){
      var message = $('#submit-message').find('input[id="message"]').val().trim();;
      var room_key = $('#room_key').text().trim();
      alert(message+' '+room_key);
      
      $.ajax({ 
        type: "POST", 
        url: '/speaker/listeners/message', 
        data: {room: room_key, message:message}, 
        success: function(response){ 
           alert('Message sent!');
        }
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
              socket.on('listener',function(obj){
                  if (obj.verb == 'created') {
                    //Evento de um novo listener criado
                    updateUsers();
                  }

                  if (obj.verb == 'updated') {
                      //Evento de um listener setado para online ou offline 
                      updateUsers();
                    }
               });

              socket.on('welcome-message', function(data){
                    console.log('New message received from server: '+data);
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
