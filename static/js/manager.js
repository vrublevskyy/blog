function loadMyEntries() {

  $.ajax({
    url: 'https://www.paradisecity.me:8082/loadMyentrys',
    type: 'GET',
    dataType: 'json',
    success: function(reply) {
      for (var i = 0; i < reply.length; i++) {
        if (typeof reply[i] === 'object' ) {
          var id = reply[i]._id;
          var text = null;
          var image = null;
          var tags = null;
          var date = reply[i].lastModification;
          var title = reply[i].title;
          var author = reply[i].owner;
          var comments = null;
          var publish = "";
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
          if (reply[i].state !== 'Published') {
            publish = "<p class=\"lead\"><button  onclick=\"publish(\'"+id+"\')\" class=\"btn btn-default\">Publish</button></p>"
          }
          else {
              publish = "<p class=\"lead\">PUBLISHED</p>"
          }


            $( "#myEntries" ).append("<div class=\"row\">   \
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
                      <p class=\"lead\"><button  onclick=\"edit(\'"+id+"\')\" class=\"btn btn-default\">Edit</button></p>   \
                      <p class=\"lead\"><button  onclick=\"delete(\'"+id+"\')\" class=\"btn btn-default\">Delete</button></p>   \
                      \  "+publish+"
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

const readMore = function (id) {

  window.location.href = 'https://www.paradisecity.me:8082/view/'+id;
}
const edit = function (id) {

  window.location.href = 'https://www.paradisecity.me:8082/editEntry/'+id;
}

const publish = function (id) {
  $.ajax({
    url: 'https://www.paradisecity.me:8082/publish/'+id,
    type: 'POST',
    dataType: 'json',
    success: function(reply) {
      location.reload();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
    }
  });
}

const delete = function (id) {
  $.ajax({
    url: 'https://www.paradisecity.me:8082/deleteDoc/'+id,
    type: 'POST',
    dataType: 'json',
    success: function(reply) {
      location.reload();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
    }
  });
}
