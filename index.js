'use strict';
/*
var    mongoose = require('mongoose');

//la base de datos esta en el mismo servidor
mongoose.connect('mongodb://localhost/facultades');

var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("OPEN")
    });

var control=require('./controllers/facultades');

*/
const Hapi = require('hapi');
const FS = require('fs');
let uuid = 1;       // Use seq instead of proper unique identifiers for demo only

const users = {
    john: {
        id: 'john',
        password: 'password',
        name: 'John Doe'
    }
};

const home = function (request, reply) {

    reply('<!DOCTYPE html><html><head><title>Login page</title></head><body><h3>Welcome ' +
      request.auth.credentials.name +
      '!</h3><br/><form method="get" action="/logout">' +
      '<input type="submit" value="Logout">' +
      '</form></body></html>');
};

const login = function (request, reply) {

    if (request.auth.isAuthenticated) {

        return reply.redirect('/');
    }

    let message = '';
    let account = null;

    if (request.method === 'post') {

        if (!request.payload.username ||
            !request.payload.password) {

            message = 'Missing username or password';
        }
        else {
            account = users[request.payload.username];
            if (!account ||
                account.password !== request.payload.password) {

                message = 'Invalid username or password';
            }
        }
    }

    if (request.method === 'get' ||
        message) {

        return reply('<html><head><title>Login page</title></head><body>' +
            (message ? '<h3>' + message + '</h3><br/>' : '') +
            '<form method="post" action="/login">' +
            'Username: <input type="text" name="username"><br>' +
            'Password: <input type="password" name="password"><br/>' +
            '<input type="submit" value="Login"></form></body></html>');
    }

    const sid = String(++uuid);
    request.server.app.cache.set(sid, { account: account }, 0, (err) => {

        if (err) {
            reply(err);
        }

        request.cookieAuth.set({ sid: sid });
        console.log(request.cookieAuth)
        return reply.redirect('/');
    });
};

const logout = function (request, reply) {

    request.cookieAuth.clear();
    return reply.redirect('/');
};

server.route({
    method: 'GET',
    path: '/js/{param*}',
    handler: {
        directory: {
            path: '/root/pec2/client/js',
            listing: true
        }
    }
});
server.route({
    method: 'GET',
    path: '/css/{param*}',
    handler: {
        directory: {
            path: '/root/pec2/client/css',
            listing: true
        }
    }
});
server.route({
    method: 'GET',
    path: '/dist/{param*}',
    handler: {
        directory: {
            path: '/root/pec2/client/dist',
            listing: true
        }
    }
});
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '/root/pec2/client/',
            listing: true
        }
    }
});



const server = new Hapi.Server();
server.connection({
 host: '0.0.0.0',
 port: 80,
 tls: {
    key: FS.readFileSync('../certs/blog-key.pem', 'utf8'),
    cert: FS.readFileSync('../certs/blog-cert.pem', 'utf8')
 } });


server.register(require('hapi-auth-cookie'), (err) => {

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


});

    server.route([
        { method: 'GET', path: '/', config: { handler: home } },
        { method: ['GET', 'POST'], path: '/login', config: { handler: login, auth: { mode: 'try' }, plugins: { 'hapi-auth-cookie': { redirectTo: false } } } },
        { method: 'GET', path: '/logout', config: { handler: logout } }
    ]);

    server.start(() => {

        console.log('Server ready');
    });
});
