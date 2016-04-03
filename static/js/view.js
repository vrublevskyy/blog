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
    type: 'post',
    dataType: 'json',
    data:{
      'documentID':documentID
    },
    success: function(reply) {
      var items = reply.content;
      document.getElementById("title").value = reply.title;
      $('.grid-stack').each(function () {
        var grid = $(this).data('gridstack');

        _.each(items, function (node) {
          switch (node.data.type) {
            case "title":
              grid.addWidget($('<textarea customType='+node.data.type+' class="boxContent" style="font-size: 20pt resize:vertical" readonly></textarea>'),
              node.x, node.y, node.width, node.height);
            break;
            case "text":
              grid.addWidget($('<textarea customType='+node.data.type+' class="boxContent" style="font-size: 13pt resize:vertical" readonly></textarea>'),
              node.x, node.y, node.width, node.height);
            break;
            case "image":
              grid.addWidget($('<div customType='+node.data.type+' class="boxContent" ><img src=\"'+node.data.content+'\"></img></div>'),
              node.x, node.y, node.width, node.height);
            break;
            case "comments":
              grid.addWidget($('<div customType='+node.data.type+' class="detailBox boxContent">  \
                  <div class="titleBox">\
                    <label>Comment Box</label>\
                      <button type="button" class="close" aria-hidden="true">&times;</button>\
                  </div>\
                  <div class="commentBox">\
                  </div>\
                  <div class="actionBox">\
                      <ul class="commentList">\
                      </ul>\
                      <form class="form-inline" role="form">\
                          <div class="form-group">\
                              <input class="form-control" type="text" placeholder="Your comments" />\
                          </div>\
                          <div class="form-group">\
                              <button class="btn btn-default">Add</button>\
                          </div>\
                      </form>\
                  </div>\
              </div>'),
              node.x, node.y, node.width, node.height);
            break;
            case "index":
              grid.addWidget($('<div>'+node.data.content+'</div>'),
              node.x, node.y, node.width, node.height);
            break;
          }

        }, this);
      });

    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
    }
  });
}

$( document ).ready(function() {
    loadByID();
});