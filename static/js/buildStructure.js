var filledData = {};

function loadGrid(items) {
  $('.grid-stack').each(function () {
    var grid = $(this).data('gridstack');

    _.each(items, function (node) {

      if (node.data.content) {
        var id = JSON.stringify(node.x)+ JSON.stringify(node.y)+ JSON.stringify(node.width)+ JSON.stringify(node.height);
        filledData[id]=node.data.content;
      }
      switch (node.data.type) {
        case "title":
          grid.addWidget($('<div customType="title" style="margin:5px"><div  class="grid-stack-item-content glyphicon glyphicon-text-width" ></div></div>'),
          node.x, node.y, node.width, node.height);
        break;
        case "text":
          grid.addWidget($('<div customType="text" style="margin:5px"><div class="grid-stack-item-content glyphicon glyphicon-pencil" ></div></div>'),
          node.x, node.y, node.width, node.height);
        break;
        case "image":
          grid.addWidget($('<div customType="image" style="margin:5px"><div class="grid-stack-item-content glyphicon glyphicon-picture" ></div></div>'),
          node.x, node.y, node.width, node.height);
        break;
        case "comments":
          grid.addWidget($('<div customType="comments" style="margin:5px"><div class="grid-stack-item-content glyphicon glyphicon-comment" ></div></div>'),
          node.x, node.y, node.width, node.height);
        break;
        case "index":
          grid.addWidget($('<div customType="index" style="margin:5px"><div class="grid-stack-item-content glyphicon glyphicon-align-left" ></div></div>'),
          node.x, node.y, node.width, node.height);
        break;
      }

    }, this);
  });
}

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


  if (document.getElementById("documentID") && document.getElementById("documentID").text && document.getElementById("documentID").text != 'Nuevo documento') {
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
        loadGrid(items);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        loadGrid(items);
        console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
      }
    });
  }

  else {
    loadGrid(items);
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

  var id=document.getElementById("documentID").text;
  if (id && id == 'Nuevo documento') {
    id = ""
  }
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
        window.location.href = 'https://www.paradisecity.me:8082/editEntry/'+documentId;
      }
      else {
        window.location.href = 'https://www.paradisecity.me:8082/index/';
      }
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
  console.log(node);
  var id = JSON.stringify(node.x)+ JSON.stringify(node.y)+ JSON.stringify(node.width)+ JSON.stringify(node.height);
  var content=filledData[id];

  if (!content) {
    content = ""
  }
  return {
      id: el.attr('data-custom-id'),
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      data:{
        type:customtype,
        content:content
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
