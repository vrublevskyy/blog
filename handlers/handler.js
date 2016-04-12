
'use strict'

var userController =require('../controllers/user.js');
var entryController =require('../controllers/entry.js');

const home = function (request, reply) {

  reply.view('index', { user: request.auth.credentials.name });
};



const logout = function (request, reply) {

  request.cookieAuth.clear();
  return reply.redirect('/login');
};

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

const buildStructure = function (request, reply) {

  if (request.params.documentId) {
    const id = request.params.documentId;
    reply.view('buildStructure', { user: request.auth.credentials.name,documentID:id });
  }
  else {
    reply.view('buildStructure', { user: request.auth.credentials.name,documentID:"Nuevo documento" });
  }

};

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

const view = function (request, reply) {

  if (request.params.documentId) {
    reply.view('view', { user: request.auth.credentials.name, documentID: request.params.documentId });
  }
  else {
    reply.view('index', { user: request.auth.credentials.name });
  }


};

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

const addComment = function (request, reply) {

}


const getAllEntries = function (request, reply) {

  entryController.getAllEntries(request.payload.documentID,function (err,data) {
    if (!err) {
      reply(data);
    }else {
      console.log(err)
      reply(err)
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
