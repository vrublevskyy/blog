//Controlador de la aplicación
//metodos para acceder a la base de datos
var mongoose = require('mongoose')
var Entry=require('../models/entry');
var exports = module.exports

//Todos los metodos tienen un callback

//Añade nueva facultad
exports.addEntry=function(data,callback) {

  var entry=new Entry({
    'owner': data.owner,
    'title':data.title,
    'state':data.state,
    'record':[data.record]
  });
  entry.save(function(err, facultad1) {
    if (callback) {
      return callback(err);
    }
  });
};

//Devuelve todos los datos
exports.getAllEntry = function(callback) {
  Entry.find(function(err, facultades) {
    if (callback) {
      return callback(err,facultades);
    }
  });
};

//Busca por nombre
exports.findByOwner=function(filter,callback) {
  Entry.findOne({ 'owner': filter }, '', function (err, facultad) {
    if (callback) {
      return callback(err,facultad);
    }
  })
}
exports.findByTitle=function(filter,callback) {
  Entry.findOne({ 'title': filter }, '', function (err, facultad) {
    if (callback) {
      return callback(err,facultad);
    }
  })
}

//Busca por ID
exports.findById=function(filter,callback) {
  Entry.findOne({ '_id': filter }, '', function (err, facultad) {
    if (callback) {
      return callback(err,facultad);
    }
  })
}

//Elimina un elemnto
exports.remove=function(id,callback) {
  Entry.remove({ _id: id }, function(err) {
    if (callback) {
      return callback(err,id)
    }

  });
}

//Actuañiza la facultad, si no existe no lo crea
exports.updateTitle=function(id,data,callback) {
	 Entry.update({_id: id},{ 'title':data.title}, {upsert: false}, function(err,data) {
        if (callback) {
          return callback(err,data);
        }
      });
}
//Actuañiza la facultad, si no existe no lo crea
exports.updateState=function(id,data,callback) {
	 Entry.update({_id: id},{ 'state':data.state}, {upsert: false}, function(err,data) {
        if (callback) {
          return callback(err,data);
        }
      });
}
//Actuañiza la facultad, si no existe no lo crea
exports.updateRecord=function(id,data,callback) {
  Entry.findByIdAndUpdate(
   id,
   {$push: {record: data.record}},
   {safe: true, upsert: false},
   function(err, model) {
       console.log(err);
   }
);
}
