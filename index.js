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
              console.log(request.cookieAuth)
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

  reply.view('buildStructure', { user: request.auth.credentials.name });
};

const saveStructure = function (request, reply) {
  console.log(JSON.parse(request.payload));
  entryController.addEntry(JSON.parse(request.payload),function (err) {
    if (!err) {
      return reply.redirect('/');
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
    { method: 'POST', path: '/saveStructure', config: { handler: saveStructure } },
    { method: 'GET', path: '/buildStructure', config: { handler: buildStructure } }
  ]);

  server.start(() => {

    console.log('Server ready');
  });
