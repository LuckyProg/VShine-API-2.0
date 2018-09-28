'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LavadoSchema = Schema({
    direccion: String,
    ubicacion: {
        latitud: Number,
        longitud: Number
    },
    fecha: Date,
    tipo: String,
    pago: String,
    estado: String,
    usuario: {type: Schema.ObjectId, ref: 'Usuario'},
    auto: {type: Schema.ObjectId, ref: 'Auto' }


});