'use strict';

var    mongoose = require('mongoose');

//la base de datos esta en el mismo servidor
mongoose.connect('mongodb://localhost/blog');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("OPEN")
});


const handler = require('./handlers/handler.js')

const Hapi = require('hapi');
const FS = require('fs');
let uuid = 1; 





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
      redirectTo: '/login',
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

  const routes = new require('./routes/staticRoutes.js').staticRoutes(server)

  server.route([
    { method: 'GET', path: '/', config: { handler: handler.home } },
    { method: ['GET', 'POST'], path: '/login', config: { handler: handler.login, auth: { mode: 'try' }, plugins: { 'hapi-auth-cookie': { redirectTo: false } } } },
    { method: 'GET', path: '/logout', config: { handler: handler.logout } },
    { method: ['GET', 'POST'], path: '/register',  config: { handler: handler.register, auth: { mode: 'try' }, plugins: { 'hapi-auth-cookie': { redirectTo: false } } }},
    { method: 'POST', path: '/saveStructure/{documentId?}', config: { handler: handler.saveStructure } },
    { method: 'GET', path: '/buildStructure/{documentId?}', config: { handler: handler.buildStructure } },
    { method: 'GET', path: '/view/{documentId?}', config: { handler: handler.view } },
    { method: ['GET', 'POST'], path: '/editEntry/{documentId?}', config: { handler: handler.editEntry } },
    { method: ['POST'], path: '/getEntry', config: { handler: handler.getEntry } },
    { method: ['POST'], path: '/addComment', config: { handler: handler.addComment } },
  ]);

  server.start(() => {

    console.log('Server ready');
  });
