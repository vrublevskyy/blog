$.ajax({
  url: 'https://www.paradisecity.me:5000/isLoggedIn',
  type: 'get',
  dataType: 'json',
  success: function(reply) {
    console.log(reply)

    if (reply.isLoggedIn) {
      $('#navbarLogin').append'(<li><a href="https://www.paradisecity.me:8082/manager">'+reply.user+'</a></li>');

      }
      else {
        $('#navbarLogin').append'(<li><a href="https://www.paradisecity.me:8082/login">Iniciar sesión</a></li>');
     }

  },
  error: function(XMLHttpRequest, textStatus, errorThrown) {
    console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
  }
});
