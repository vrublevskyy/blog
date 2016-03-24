//Controlador de la aplicación
//metodos para acceder a la base de datos
var mongoose = require('mongoose')
var Entry=require('../models/entry');
var exports = module.exports

//Todos los metodos tienen un callback

//Añade nueva entry
exports.addEntry=function(data,callback) {

  var entry=new Entry({
    'owner': data.owner,
    'title':data.title,
    'state':data.state,
    'lastModification':data.date,
    'content':data.content
  });
  entry.save(function(err, data) {
    if (callback) {
      return callback(err,data);
    }
  });
};

//Devuelve todos los datos
exports.getAllEntries = function(callback) {
  Entry.find(function(err, entries) {
    if (callback) {
      return callback(err,entries);
    }
  });
};

//Busca por nombre
exports.findByOwner=function(filter,callback) {
  Entry.findOne({ 'owner': filter }, '', function (err, entry) {
    if (callback) {
      return callback(err,entry);
    }
  })
}
exports.findByTitle=function(filter,callback) {
  Entry.findOne({ 'title': filter }, '', function (err, entry) {
    if (callback) {
      return callback(err,entry);
    }
  })
}

//Busca por ID
exports.findById=function(filter,callback) {
  Entry.findOne({ '_id': filter }, '', function (err, entry) {
    if (callback) {
      return callback(err,entry);
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

//Actuañiza la entry, si no existe no lo crea
exports.updateTitle=function(id,data,callback) {
	 Entry.update({_id: id},{ 'title':data.title}, {upsert: false}, function(err,data) {
        if (callback) {
          return callback(err,data);
        }
      });
}
exports.updateOwner=function(id,data,callback) {
	 Entry.update({_id: id},{ 'owner':data.owner}, {upsert: false}, function(err,data) {
        if (callback) {
          return callback(err,data);
        }
      });
}
//Actuañiza la entry, si no existe no lo crea
exports.updateState=function(id,data,callback) {
	 Entry.update({_id: id},{ 'state':data.state}, {upsert: false}, function(err,data) {
        if (callback) {
          return callback(err,data);
        }
      });
}
//Actuañiza la entry, si no existe no lo crea
exports.updateDate=function(id,data,callback) {
	 Entry.update({_id: id},{ 'lastModification':data.date}, {upsert: false}, function(err,data) {
        if (callback) {
          return callback(err,data);
        }
      });
}
//Actuañiza la entry, si no existe no lo crea
exports.updateContent=function(id,data,callback) {
	 Entry.update({_id: id},{ 'content':data.content}, {upsert: false}, function(err,data) {
        if (callback) {
          return callback(err,data);
        }
      });
}
