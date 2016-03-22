//Modelo de datos para guardar GeoJson de las facultades
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

    var entry =  mongoose.Schema ({
      'owner': {
        type: String,
        required: true,
        default: 'admin'
      },
      'title':{
        type: String,
        required: true
      },
      'state': {
          type: String,
          required: true,
          enum: ['Published', 'InProgress'],
          default: 'InProgress'
        },
        'record':
          [
            {
              'date':{
                type: Date,
                required: true,
              },
              'content':[{
                'x': {
                  type: Number,
                  required: true,
                },
                'y': {
                  type: Number,
                  required: true,
                },
                'width': {
                  type: Number,
                  required: true,
                },
                'height': {
                  type: Number,
                  required: true,
                },
                data:{
                  'type':{
                    type: String,
                    required: true,
                  },
                  'properties':{
                    type: Schema.Types.Mixed,
                    required: false,
                  },
                  'content':{
                    type: Schema.Types.Mixed,
                    required: false,
                  }
                }
              }]

            }
          ]
      }
    });

module.exports=mongoose.model('Entry', entry);
