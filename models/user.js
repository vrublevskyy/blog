//Modelo de datos para guardar GeoJson de las facultades
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

    var user =  mongoose.Schema ({
      'name': {
        type: String,
        required: true,
        default: 'Feature'
      },
      'pass': {
        'type': {
          type: String,
          required: true,
          default: '1234'
        }
      }
    });

module.exports=mongoose.model('User', user);
