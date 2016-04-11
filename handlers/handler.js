
var userController =require('./controllers/user.js');
var entryController =require('./controllers/entry.js');

const home = function (request, reply) {

  reply.view('index', { user: request.auth.credentials.name });
};

const login = function (request, reply) {

  if (request.auth.isAuthenticated) {

    return reply.redirect('/');
  }

  let message = '';
  let account = null;

  if (request.method === 'post') {

    if (!request.payload.user || !request.payload.password) {
      message = 'Missing username or password';
    }
    else {
      userController.findByUser(request.payload.user,function (err,user) {
        if (!err) {
          account=user;

          if (!account || account.password !== request.payload.password) {
            message = 'Invalid username or password';
          }
          else{
            const sid = String(++uuid);
            request.server.app.cache.set(sid, { account: account }, 0, (err) => {

              if (err) {
                reply(err);
              }

              request.cookieAuth.set({ sid: sid });
              return reply.redirect('/');
            });
          }
        }
        else {
          message = 'Invalid username or password';
        }
      });

    }
  }

  if (request.method === 'get' || message) {

    return reply.file('/root/pec2/server/templates/login.html')
  }


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

module.exports.home= home;
module.exports.login= login;
module.exports.logout= logout;
module.exports.register= register;
module.exports.buildStructure= buildStructure;
module.exports.saveStructure= saveStructure;
module.exports.editEntry= editEntry;
module.exports.view= view;
module.exports.getEntry= getEntry;
