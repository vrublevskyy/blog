'use strict'

//Rutas a los elementos estaticos de la pagina js,css...
const staticRoutes = function (server) {

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
}

module.exports.staticRoutes = staticRoutes;
