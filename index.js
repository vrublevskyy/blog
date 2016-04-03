'use strict';

var    mongoose = require('mongoose');

//la base de datos esta en el mismo servidor
mongoose.connect('mongodb://localhost/blog');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("OPEN")
});

var userController =require('./controllers/user.js');
var entryController =require('./controllers/entry.js');

const Hapi = require('hapi');
const FS = require('fs');
let uuid = 1;       // Use seq instead of proper unique identifiers for demo only



const home = function (request, reply) {
  /*
  reply.file('<!DOCTYPE html><html><head><title>Login page</title></head><body><h3>Welcome ' +
  request.auth.credentials.name +
  '!</h3><br/><form method="get" action="/logout">' +
  '<input type="submit" value="Logout">' +
  '</form></body></html>');

  */
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

const fillStructure = function (request, reply) {

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
    reply.view('fillStructure', { user: request.auth.credentials.name, documentID: id });
  }
};

const view = function (request, reply) {

    if (request.params.documentId) {
      reply.view('view', { user: request.auth.credentials.name, documentId: request.params.documentId });
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

const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: 8082,
  tls: {
    key: FS.readFileSync('../certs/blog-key.pem', 'utf8'),
    cert: FS.readFileSync('../certs/blog-cert.pem', 'utf8')
  } });


  server.register([require('hapi-auth-cookie'),require('inert'),require('vision')], (err) => {

    if (err) {
      throw err;
    }

    const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
    server.app.cache = cache;

    server.auth.strategy('session', 'cookie', true, {
      password: 'password-should-be-32-characters',
      cookie: 'sid-example',
      redirectTo: '/',
      isSecure: true,
      validateFunc: function (request, session, callback) {

        cache.get(session.sid, (err, cached) => {

          if (err) {
            return callback(err, false);
          }

          if (!cached) {
            return callback(null, false);
          }

          return callback(null, true, cached.account);
        });
      }
    });

    server.views({
      engines: {
        html: require('handlebars')
      },
      relativeTo: __dirname,
      path: 'templates'
    });



  });
  server.route({
    method: 'GET',
    path: '/static/js/{param*}',
    handler: {
      directory: {
        path: '/root/pec2/server/static/js',
        listing: true
      }
    }
  });
  server.route({
    method: 'GET',
    path: '/static/css/{param*}',
    handler: {
      directory: {
        path: '/root/pec2/server/static/css',
        listing: true
      }
    }
  });
  server.route({
    method: 'GET',
    path: '/static/fonts/{param*}',
    handler: {
      directory: {
        path: '/root/pec2/server/static/fonts',
        listing: true
      }
    }
  });


  server.route([
    { method: 'GET', path: '/', config: { handler: home } },
    { method: ['GET', 'POST'], path: '/login', config: { handler: login, auth: { mode: 'try' }, plugins: { 'hapi-auth-cookie': { redirectTo: false } } } },
    { method: 'GET', path: '/logout', config: { handler: logout } },
    { method: ['GET', 'POST'], path: '/register',  config: { handler: register, auth: { mode: 'try' }, plugins: { 'hapi-auth-cookie': { redirectTo: false } } }},
    { method: 'POST', path: '/saveStructure/{documentId?}', config: { handler: saveStructure } },
    { method: 'GET', path: '/buildStructure/{documentId?}', config: { handler: buildStructure } },
    { method: 'GET', path: '/view/{documentId?}', config: { handler: view } },
    { method: ['GET', 'POST'], path: '/fillStructure/{documentId?}', config: { handler: fillStructure } },
    { method: ['POST'], path: '/getEntry', config: { handler: getEntry } }
  ]);

  server.start(() => {

    console.log('Server ready');
  });
