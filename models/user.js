//Modelo de datos para guardar GeoJson de las facultades
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

    var user =  mongoose.Schema ({
      'user': {
        type: String,
        required: true
      },
      'password': {
        'type': {
          type: String,
          required: true
        }
      },
      'email': {
        type: String,
        required: true,
      },
      'name': {
        type: String,
        required: true,
      }
    });

module.exports=mongoose.model('User', user);
