
'use strict'
//Controladores del servidor
var userController =require('../controllers/user.js');
var entryController =require('../controllers/entry.js');

const home = function (request, reply) {

  reply.view('index', { user: request.auth.credentials.name });
};


//limpia cookies y redirige a login
const logout = function (request, reply) {

  request.cookieAuth.clear();
  return reply.redirect('/login');
};


//añade nuevo usuario
const register = function (request, reply) {

  userController.addUser(request.payload,function (err) {
    if (!err) {
      return reply.redirect('/');
    }else {
      console.log(err)
      return reply.redirect('/login')
    }
  })

};


//Plantilla de construccion del blog
const buildStructure = function (request, reply) {

  if (request.params.documentId) {
    const id = request.params.documentId;
    reply.view('buildStructure', { user: request.auth.credentials.name,documentID:id });
  }
  else {
    reply.view('buildStructure', { user: request.auth.credentials.name,documentID:"Nuevo documento" });
  }

};

//Guarda la estructura generada por los clientes
const saveStructure = function (request, reply) {

  if (request.params.documentId) {

    entryController.updateAll(request.params.documentId,JSON.parse(request.payload.structure),function (err,data) {
      if (!err) {
        reply({err:false,documentId:request.params.documentId})
      }else {
        console.log(err)
        reply({err:true,documentId:data._id})
      }
    })
  }
  else {
    entryController.addEntry(JSON.parse(request.payload.structure),function (err,data) {
      if (!err) {
        reply({err:false,documentId:data._id})
      }else {
        console.log(err)
        reply({err:true,documentId:data._id})
      }
    })
  }


};


// Si es POST añade la estrucutra si GET devuelve la plantilla para rellenar datos
const editEntry = function (request, reply) {

  if (request.method === 'post' ) {
    console.log(JSON.parse(request.payload.structure));
    entryController.addEntry(JSON.parse(request.payload.structure),function (err) {
      if (!err) {
        reply({err:false,documentId:data._id})

      }else {
        console.log(err)
        reply({err:true})
      }

    })
  }
  else if (request.method === 'get') {
    const id = request.params.documentId;
    reply.view('editEntry', { user: request.auth.credentials.name, documentID: id });
  }
};

//Devuelve una entrada del blog para modo lectura
const view = function (request, reply) {

  if (request.params.documentId) {
    reply.view('view', { user: request.auth.credentials.name, documentID: request.params.documentId });
  }
  else {
    reply.view('index', { user: request.auth.credentials.name });
  }


};

//Devuelve una entrada del blog especificada en el parametro
const getEntry = function (request, reply) {

  entryController.findById(request.payload.documentID,function (err,data) {
    if (!err) {
      reply(data);
    }else {
      console.log(err)
      return reply.redirect('/login')
    }
  })
};


//TODO no implementado
const addComment = function (request, reply) {

}


const getAllentries = function (request, reply) {
  var published = []
  entryController.getAllentries(function (err,data) {
    if (!err) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].state == 'Published') {
          published.push(data[i])
        }
      }
      reply(published);
    }else {
      console.log(err)
      reply(err)
    }
  })
}

//Devuelve la plantilla de administracion TODO hacerla totalmente operativa
const manager = function (request, reply) {

  reply.view('manager', { user: request.auth.credentials.name });
};

const loadMyEntries = function (request, reply) {
  var usersDocs=[];
  entryController.getAllentries(function (err,data) {
    if (!err) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].owner === request.auth.credentials.name) {
          usersDocs.push(data[i])
        }
      }
      reply(usersDocs);
    }else {
      console.log(err)
      reply(err)
    }
  })
}
//Publica una entrada
const publish = function (request, reply) {

  entryController.findById(request.payload.documentID,function (err,data) {
    if (!err) {
      if (request.auth.credentials.name === data.owner) {
        entryController.publish(data._id,function (err,data) {
          if (!err) {
            reply("OK");
          }else {
            console.log(err)
            return reply(err)
          }
        });
      }
    }else {
      console.log(err)
      return reply(err)
    }
  })

}
//Elimina un documento
const deleteDoc = function (request, reply) {
  entryController.findById(request.payload.documentID,function (err,data) {
    if (!err) {
      if (request.auth.credentials.name === data.owner) {
        entryController.remove(data._id,function (err,data) {
          if (!err) {
            reply("OK");
          }else {
            console.log(err)
            return reply(err)
          }
        });
      }
    }else {
      console.log(err)
      return reply(err)
    }
  })
}

module.exports.home= home;
module.exports.logout= logout;
module.exports.register= register;
module.exports.buildStructure= buildStructure;
module.exports.saveStructure= saveStructure;
module.exports.editEntry= editEntry;
module.exports.view= view;
module.exports.getEntry= getEntry;
module.exports.addComment=addComment;
module.exports.getAllentries=getAllentries;
module.exports.loadMyEntries=loadMyEntries;
module.exports.manager=manager;
module.exports.publish=publish;
module.exports.deleteDoc=deleteDoc;
