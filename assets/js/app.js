$(document).ready(function() {
  updateUsers();  
  
  function updateUsers(){
    $.ajax({
            dataType: "json",
            url: 'http://localhost:1337/speaker/listeners/find',
            success: function(users){
              $('#users').empty();
              $('#users').append('<ul>');
                console.log(users);
                $.each(users, function (index) {
                    $('#users').append('<li>'+users[index].id+'</li>');
                    $('#users').append('<li>'+users[index].name+'</li>');
                    $('#users').append('<li>'+users[index].email+'</li>');
                    $('#users').append('<li>'+users[index].online+'</li>');
                    $('#users').append('<hr>');
                });
                $('#users').append('</ul>');
            }
          });
  };

  $('#updateUsers').click(function(){
      var name = $('#submit-form').find('input[id="name_user"]').val();
      var email = $('#submit-form').find('input[id="email_user"]').val();
      alert('Name: '+name+ 'Email: '+email);

      alert(name+" "+email);
      socket.post('/speaker/listeners/create', {name:name, email:email}, function (data, jwres){
      });
  });
  

   //socket = socket || io.connect();
   var socket = io.connect();
   socket.on("connect", function () {
              //updateUsers();
              url = 'http://localhost:1337/speaker/listeners/subscribe';
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
                    alert('Refresh list');
                    updateUsers();
                  }

                  if (obj.verb == 'updated') {
                      console.log('Socket was updated!!');
                    }
               });
             
   });

   
  

  /*
  $("#action_login").click(function() {
    //$('.form-signin').find('input[name="email"]').val();
    
  });
  */
});
