//Controlador de la aplicación
//metodos para acceder a la base de datos
var mongoose = require('mongoose')
var User=require('../models/user');
var exports = module.exports

//Todos los metodos tienen un callback

//Añade nueva facultad
exports.addUser=function(data,callback) {
  var user=new User({
    user: data.user,
    name: data.name,
    password: data.password,
    email: data.email
  });
  user.save(function(err, user) {
    if (callback) {
      return callback(err);
    }
  });
};

//Devuelve todos los datos
exports.getUsers = function(callback) {
  User.find(function(err, users) {
    if (callback) {
      return callback(err,users);
    }
  });
};

//Busca por nombre
exports.findByUser=function(filter,callback) {
  User.findOne({ 'user': filter }, '', function (err, user) {
    if (callback) {
      return callback(err,user);
    }
  })
}

//Busca por ID
exports.findById=function(filter,callback) {
  User.findOne({ '_id': filter }, '', function (err, user) {
    if (callback) {
      return callback(err,user);
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

//Actuañiza la user, si no existe no lo crea
exports.updatePass=function(id,data,callback) {
	 User.update({_id: id},{ 'pass':data.pass}, {upsert: false}, function(err,data) {
        if (callback) {
          return callback(err,data);
        }
      });
}
