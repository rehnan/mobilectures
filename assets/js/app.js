$(document).ready(function() {
  updateUsers();  
  
  function updateUsers(){
    $.ajax({
            dataType: "json",
            url: '/speaker/listeners/find',
            success: function(users){
              $('#users').empty();
              $('#users').append('<ul>');
                console.log(users);
                $.each(users, function (index) {
                    $('#users').append('<li>'+users[index].id+'</li>');
                    $('#users').append('<li>'+users[index].name+'</li>');
                    $('#users').append('<li>'+users[index].email+'</li>');
                    $('#users').append('<li>'+users[index].password+'</li>');
                    $('#users').append('<li>'+users[index].online+'</li>');
                    $('#users').append('<hr>');
                });
                $('#users').append('</ul>');
            }
          });
  };

  //Método socket para logar
   $('#signin').click(function(){
      var em_user = $('#submit-signin').find('input[id="em_user"]').val();
      var pass_user = $('#submit-signin').find('input[id="pass_user"]').val();
      socket.get('/speaker/listeners/join', {email:em_user, password:pass_user}, function (data, jwres){
          alert("Response: "+data.authorization);        
      });
  });

  //Método socket para deslogar
  $('#signout').click(function(){
      var user_id = $('#submit-signout').find('input[id="user_id"]').val();
      socket.get('/speaker/listeners/leave/'+user_id, function (data, jwres){
      });
  });

  //Método socket para criar usuário
  $('#createUser').click(function(){
      var name = $('#submit-create').find('input[id="name_user"]').val();
      var email = $('#submit-create').find('input[id="email_user"]').val();
      var password = $('#submit-create').find('input[id="password_user"]').val();

      socket.post('/speaker/listeners/create', {name:name, email:email, password:password}, function (data, jwres){
      });
  });

  //Método socket update 
  $('#updateUser').click(function(){
      var id = $('#submit-update').find('input[id="id_user"]').val();
      var email = $('#submit-update').find('input[id="newname_user"]').val();
      alert('ID: '+id+ 'Email: '+email);

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
                    console.log('New socket was created!!');
                    alert('Refresh after create');
                    updateUsers();
                  }

                  if (obj.verb == 'updated') {
                      console.log('Socket was updated!!');
                      alert('Refresh after update');
                      updateUsers();
                    }
               });
             
   });

   
  

  /*
  $("#action_login").click(function() {
    //$('.form-signin').find('input[name="email"]').val();
    
  });
  */
});
