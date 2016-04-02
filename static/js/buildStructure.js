function loadStructure() {
  var options = {
    width: 6,
    float: false,
    removable: '.trash',
    removeTimeout: 100,
    acceptWidgets: '.grid-stack-item'
  };
  $('#grid1').gridstack(options);

  var items = [
    {x: 0, y: 0, width: 5, height: 1,data:{'type':"title"}},
    {x: 0, y: 2, width: 3, height: 4,data:{'type':"text"}},
    {x: 3, y: 3, width: 2, height: 4,data:{'type':"image"}},
    {x: 0, y: 6, width: 6, height: 5,data:{'type':"comments"}},
    {x: 5, y: 1, width: 0, height: 5,data:{'type':"index"}}

  ];


  if (document.getElementById("documentID") && document.getElementById("documentID").text) {
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

  else {
    $('.grid-stack').each(function () {
      var grid = $(this).data('gridstack');

      _.each(items, function (node) {
        switch (node.data.type) {
          case "title":
            grid.addWidget($('<div customType="title"><div  class="grid-stack-item-content glyphicon glyphicon-text-width" ></div></div>'),
            node.x, node.y, node.width, node.height);
          break;
          case "text":
            grid.addWidget($('<div customType="text"><div class="grid-stack-item-content glyphicon glyphicon-pencil" ></div></div>'),
            node.x, node.y, node.width, node.height);
          break;
          case "image":
            grid.addWidget($('<div customType="image"><div class="grid-stack-item-content glyphicon glyphicon-picture" ></div></div>'),
            node.x, node.y, node.width, node.height);
          break;
          case "comments":
            grid.addWidget($('<div customType="comments"><div class="grid-stack-item-content glyphicon glyphicon-comment" ></div></div>'),
            node.x, node.y, node.width, node.height);
          break;
          case "index":
            grid.addWidget($('<div customType="index" ><div class="grid-stack-item-content glyphicon glyphicon-align-left" ></div></div>'),
            node.x, node.y, node.width, node.height);
          break;
        }

      }, this);
    });
  }
  $('.sidebar .grid-stack-item').draggable({
    revert: 'invalid',
    handle: '.grid-stack-item-content',
    scroll: false,
    appendTo: 'body'
  });
}


$('#newTitle').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
  if (event.type != 'DOMNodeInserted') {
    $('#newTitle').append('<div style=\"position: relative;\" class="grid-stack-item ui-draggable"><div class=\"grid-stack-item-content ui-draggable-handle glyphicon glyphicon-text-width\"></div></div>');
    $('.sidebar .grid-stack-item').draggable({
      revert: 'invalid',
      handle: '.grid-stack-item-content',
      scroll: false,
      appendTo: 'body'
    });
  }
});
$('#newText').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
  if (event.type != 'DOMNodeInserted') {
    $('#newText').append('<div style=\"position: relative;\" class="grid-stack-item ui-draggable"><div class=\"grid-stack-item-content ui-draggable-handle glyphicon glyphicon-pencil\"></div></div>');
    $('.sidebar .grid-stack-item').draggable({
      revert: 'invalid',
      handle: '.grid-stack-item-content',
      scroll: false,
      appendTo: 'body'
    });
  }
});
$('#newImage').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
  if (event.type != 'DOMNodeInserted') {
    $('#newImage').append('<div style=\"position: relative;\" class="grid-stack-item ui-draggable"><div class=\"grid-stack-item-content ui-draggable-handle glyphicon glyphicon-picture\"></div></div>');
    $('.sidebar .grid-stack-item').draggable({
      revert: 'invalid',
      handle: '.grid-stack-item-content',
      scroll: false,
      appendTo: 'body'
    });
  }
});
$('#newComment').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
  if (event.type != 'DOMNodeInserted') {
    $('#newComment').append('<div style=\"position: relative;\" class="grid-stack-item ui-draggable"><div class=\"grid-stack-item-content ui-draggable-handle glyphicon glyphicon-comment\"></div></div>');
    $('.sidebar .grid-stack-item').draggable({
      revert: 'invalid',
      handle: '.grid-stack-item-content',
      scroll: false,
      appendTo: 'body'
    });
  }
});
$('#newIndex').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
  if (event.type != 'DOMNodeInserted') {
    $('#newIndex').append('<div style=\"position: relative;\" class="grid-stack-item ui-draggable"><div class=\"grid-stack-item-content ui-draggable-handle glyphicon glyphicon-align-left\"></div></div>');
    $('.sidebar .grid-stack-item').draggable({
      revert: 'invalid',
      handle: '.grid-stack-item-content',
      scroll: false,
      appendTo: 'body'
    });
  }
});

$( document ).ready(function() {
    loadStructure();
});

function sendStructure(data) {

  $.ajax({
    url: 'https://www.paradisecity.me:8082/saveStructure',
    type: 'POST',
    dataType: 'json',
    data:{
      'structure':data
    },
    success: function(reply) {
      window.location.href = 'https://www.paradisecity.me:8082/fillStructure/'+reply;
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
  var node = el.data('_gridstack_node');
  return {
      id: el.attr('data-custom-id'),
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      data:{
        type:customtype
      }
  };
  });

  var entry={
    owner:document.getElementById("user").text,
    title: document.getElementById("title").value,
    state:'InProgress',
    date:Date.now(),
    content:res
  }

  sendStructure(JSON.stringify(entry));
  console.log(JSON.stringify(entry))
}
