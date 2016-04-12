function loadByID() {
  var options = {
    width: 6,
    float: false,
    removeTimeout: 100
  };
  $('#grid1').gridstack(options);

  const documentID=document.getElementById("documentID").text
  $.ajax({
    url: 'https://www.paradisecity.me:8082/getEntry',
    type: 'GET',
    dataType: 'json',
    success: function(reply) {
      console.log(reply);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
    }
  });
}

$( document ).ready(function() {
    loadByID();
});
