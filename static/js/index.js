function loadByID() {

  $.ajax({
    url: 'https://www.paradisecity.me:8082/getAllEntries',
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
