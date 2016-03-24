$(function () {
  var options = {
    width: 6,
    float: false,
    removeTimeout: 100
  };
  $('#grid1').gridstack(options);

  var items = [
    {x: 0, y: 0, width: 5, height: 1,data:{'type':"title"}},
    {x: 0, y: 2, width: 3, height: 4,data:{'type':"text"}},
    {x: 3, y: 3, width: 2, height: 4,data:{'type':"image"}},
    {x: 0, y: 6, width: 6, height: 5,data:{'type':"comments"}},
    {x: 5, y: 1, width: 0, height: 5,data:{'type':"index"}}

  ];

  $('.grid-stack').each(function () {
    var grid = $(this).data('gridstack');

    _.each(items, function (node) {
      switch (node.data.type) {
        case "title":
          grid.addWidget($('<textarea class="boxContent" style="font-size: 20pt resize:vertical"></textarea>'),
          node.x, node.y, node.width, node.height);
        break;
        case "text":
          grid.addWidget($('<textarea class="boxContent" style="font-size: 13pt resize:vertical"></textarea>'),
          node.x, node.y, node.width, node.height);
        break;
        case "image":
          grid.addWidget($('<div class="boxContent" ><div style="margin-left:30px"><label >Image URL: </label></br><input style="width:200px" type="text" name="imageURL"></input></div></div>'),
          node.x, node.y, node.width, node.height);
        break;
        case "comments":
          grid.addWidget($('<div class="detailBox boxContent">  \
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
          grid.addWidget($('<textarea class="boxContent"></textarea>'),
          node.x, node.y, node.width, node.height);
        break;
      }

    }, this);
  });
  $('.grid-stack').gridstack({
    resizable: {
        handles: ''
    }
});

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
    id:document.getElementById("documentID").text,
    owner:document.getElementById("user").text,
    title: document.getElementById("title").value,
    state:'InProgress',
    date:Date.now(),
    content:res
  }

  preview(JSON.stringify(entry));
  console.log(JSON.stringify(entry))
}
