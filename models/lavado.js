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
    tipo: {
        type: String,
        enum: ['express', 'plus', 'pro', 'premium']
    },
    pago: {
        type: String,
        enum: ['tarjeta', 'efectivo']
    },
    estado: {
        type: String,
        enum: ['espera', 'terminado']
    },
    cliente: {
        type: Schema.ObjectId, ref: 'Usuario'
    },
    auto: {
        type: Schema.ObjectId, ref: 'Auto'
    }


});