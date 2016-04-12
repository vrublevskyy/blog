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
              var content=""
              if (node.data.content) {
                content = node.data.content;
              }
              grid.addWidget($('<textarea customType='+node.data.type+' class="boxContent" style="font-size: 22pt resize:vertical">'+content+'</textarea>'),
              node.x, node.y, node.width, node.height);
            break;
            case "text":
              var content=""
              if (node.data.content) {
                content = node.data.content;
              }
              grid.addWidget($('<textarea customType='+node.data.type+' class="boxContent" style="font-size: 13pt resize:vertical">'+content+'</textarea>'),
              node.x, node.y, node.width, node.height);
            break;
            case "image":
              var content=""
              if (node.data.content) {
                content = node.data.content;
              }
              grid.addWidget($('<textarea customType='+node.data.type+' class="boxContent" style="font-size: 13pt resize:vertical" placeholder="Insert image url">'+content+'</textarea>'),
              node.x, node.y, node.width, node.height);
            break;
            case "comments":
              grid.addWidget($('<div customType='+node.data.type+' class="detailBox boxContent">  \
                  <div class="titleBox">\
                    <label>Comments</label>\
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
            case "video":
              var content=""
              if (node.data.content) {
                content = node.data.content;
              }
              grid.addWidget($('<textarea customType='+node.data.type+' class="boxContent" placeholder="Insert VIDEO ID">'+content+'</textarea>'),
              node.x, node.y, node.width, node.height);
            break;
            case "tag":
              var content=""
              if (node.data.content) {
                if (typeof node.data.content === 'object') {
                    content = JSON.stringify(node.data.content);
                }
                else {
                  content = node.data.content;
                }

              }
              grid.addWidget($('<textarea customType='+node.data.type+' class="boxContent" placeholder="Insert tags">'+content+'</textarea>'),
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


function parseContent(callback) {
  var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
  el = $(el);
  customtype=el.context.attributes.customtype.value;
  var value=el.context.value;
  var node = el.data('_gridstack_node');
  var tagArray = null;
  if (customtype === 'tag') {
    if (value) {
      tagArray = value.split(',');
    }
  }
  if (tagArray) {
    value = tagArray;
  }
  return {
      id: el.attr('data-custom-id'),
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      data:{
        type:customtype,
        properties:'',
        content:value
      }
  };
  });

  var entry= {
    owner:document.getElementById("user").text,
    title: document.getElementById("title").value,
    state:'InProgress',
    date:Date.now(),
    content:res
  }

  callback(JSON.stringify(entry));
}

function previous() {


    parseContent((data) => {
      var id=document.getElementById("documentID").text
      console.log(id);
      $.ajax({
        url: 'https://www.paradisecity.me:8082/saveStructure/'+id,
        type: 'POST',
        dataType: 'json',
        data:{
          'structure':data
        },
        success: function(reply) {
          if (!reply.error) {
            documentId = reply.documentId
            window.location.href = 'https://www.paradisecity.me:8082/buildStructure/'+documentId;
          }
          else {
            window.location.href = 'https://www.paradisecity.me:8082/index/';
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
        }
      });
    });
}

function save() {


  parseContent((data) => {
    var id=document.getElementById("documentID").text
    $.ajax({
      url: 'https://www.paradisecity.me:8082/saveStructure/'+id,
      type: 'POST',
      dataType: 'json',
      data:{
        'structure':data
      },
      success: function(reply) {
        if (!reply.error) {
          documentId = reply.documentId
          window.location.href = 'https://www.paradisecity.me:8082/view/'+documentId;
        }
        else {
          window.location.href = 'https://www.paradisecity.me:8082/index/';
        }

      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
      }
    });
  })

}
