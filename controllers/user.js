//Controlador de la aplicación
//metodos para acceder a la base de datos
var mongoose = require('mongoose')
var User=require('../models/user');
var exports = module.exports

//Todos los metodos tienen un callback

//Añade nueva facultad
exports.addUser=function(data,callback) {

  var user=new User({
    name: data.user,
    pass: data.pass
  });
  user.save(function(err, facultad1) {
    if (callback) {
      return callback(err);
    }
  });
};

//Devuelve todos los datos
exports.getUsers = function(callback) {
  User.find(function(err, facultades) {
    if (callback) {
      return callback(err,facultades);
    }
  });
};

//Busca por nombre
exports.findPassByName=function(filter,callback) {
  User.findOne({ 'name': filter }, '', function (err, facultad) {
    if (callback) {
      return callback(err,facultad);
    }
  })
}

//Busca por ID
exports.findById=function(filter,callback) {
  User.findOne({ '_id': filter }, '', function (err, facultad) {
    if (callback) {
      return callback(err,facultad);
    }
  })
}

//Elimina un elemnto
exports.remove=function(id,callback) {
  User.remove({ _id: id }, function(err) {
    if (callback) {
      return callback(err,id)
    }

  });
}

//Actuañiza la facultad, si no existe no lo crea
exports.updatePass=function(id,data,callback) {
	 User.update({_id: id},{ 'pass':data.pass}, {upsert: false}, function(err,data) {
        if (callback) {
          return callback(err,data);
        }
      });
}
