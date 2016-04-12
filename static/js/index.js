
//Carga todos los elemntos publicados y los muestra en la pagina principal
function loadPublished() {

  $.ajax({
    url: 'https://www.paradisecity.me:8082/getAllentries',
    type: 'GET',
    dataType: 'json',
    success: function(reply) {
      for (var i = 0; i < reply.length; i++) {
        if (typeof reply[i] === 'object') {
          var id = reply[i]._id;
          var text = null;
          var image = null;
          var tags = null;
          var date = reply[i].lastModification;
          var title = reply[i].title;
          var author = reply[i].owner;
          var comments = null;
          if (reply[i].content) {
            for (var j = 0; j < reply[i].content.length; j++) {

              switch (reply[i].content[j].data.type) {
                case 'text':
                    if (!text) {
                        text = reply[i].content[j].data.content;
                    }
                  break;
                case 'image':
                    if (!image) {
                        image = reply[i].content[j].data.content;
                    }
                  break;
                case 'tags':
                    if (!tags) {
                        tags = reply[i].content[j].data.content;
                    }
                  break;
              case 'comments':
                  if (!comments && reply[i].content[j].data.content  &&reply[i].content[j].data.content.length) {
                      comments = reply[i].content[j].data.content.length;
                  }
                break;

              }
            }
            //Si no  estan definidos los pone como string vacios
            if (!tags) {
                tags = "";
            }
            if (!image) {
                image = "";
            }
            if (!text) {
                text = "";
            }
            if (!comments) {
                comments = 0;
            }
          }

          //Plantilla de lista de elemntos
            $( "#EntriesList" ).append("<div class=\"row\">   \
              <br>  \
              <div class=\"col-md-2 col-sm-3 text-center\">  \
                <a class=\"story-img\" href=\"#\"><img src=\""+image+"\" style=\"width:100px;height:100px\" class=\"img-circle\"></a>  \
              </div>  \
              <div class=\"col-md-10 col-sm-9\">  \
                <h3>"+title+"</h3>   \
                <div class=\"row\">   \
                  <div class=\"col-xs-9\">   \
                    <p>"+text.slice(0,80)+"</p>    \
                      <p class=\"lead\"><button  onclick=\"readMore(\'"+id+"\')\" class=\"btn btn-default\">Read More</button></p>   \
                      <p class=\"pull-right\"><span class=\"label label-default\">"+tags+"</span> \
                      <ul class=\"list-inline\"><li><a> "+date+"</a></li><li><a><i class=\"glyphicon glyphicon-comment\"></i> "+comments+" Comments</a></li><li><a><i class=\"glyphicon glyphicon-user\"></i>Author "+author+"</a></li></ul>   \
                    </div>   \
                    <div class=\"col-xs-3\"></div>  \
                  </div>    \
                  <br><br>    \
                </div>    \
              </div>");
        }
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
    }
  });
}

$( document ).ready(function() {
    loadPublished();
});
const readMore = function (id) {

  window.location.href = 'https://www.paradisecity.me:8082/view/'+id;
}
