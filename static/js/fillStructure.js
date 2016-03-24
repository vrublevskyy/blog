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

      $('.grid-stack').each(function () {
        var grid = $(this).data('gridstack');

        _.each(items, function (node) {
          switch (node.data.type) {
            case "title":
              grid.addWidget($('<textarea customType='+node.data.type+' class="boxContent" style="font-size: 20pt resize:vertical"></textarea>'),
              node.x, node.y, node.width, node.height);
            break;
            case "text":
              grid.addWidget($('<textarea customType='+node.data.type+' class="boxContent" style="font-size: 13pt resize:vertical"></textarea>'),
              node.x, node.y, node.width, node.height);
            break;
            case "image":
              grid.addWidget($('<div customType='+node.data.type+' class="boxContent" ><div style="margin-left:30px"><label >Image URL: </label></br><input style="width:200px" type="text" name="imageURL"></input></div></div>'),
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
              grid.addWidget($('<textarea customType='+node.data.type+' class="boxContent"></textarea>'),
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

function preview(data) {

  $.ajax({
    url: 'https://www.paradisecity.me:8082/saveStructure',
    type: 'POST',
    dataType: 'json',
    data:{
      'structure':data
    },
    success: function(reply) {
      window.location.href = 'https://www.paradisecity.me:8082/viewEntry/'+reply.documentId;
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
    }
  });
}

function next() {
  var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
  el = $(el);
  customtype=el.context.attributes.customtype.value;
  var value=el.context.value;
  var node = el.data('_gridstack_node');
  console.log(el)
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

  var entry={
    id:document.getElementById("documentID").text,
    owner:document.getElementById("user").text,
    title: document.getElementById("title").value,
    state:'InProgress',
    date:Date.now(),
    content:res
  }

  //preview(JSON.stringify(entry));
  console.log(JSON.stringify(entry))
}
