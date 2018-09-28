'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AutoSchema = Schema({
    placa: String,
    modelo: String,
    color: String,
    marca: String,
    enlavado: Boolean,
    usuario: {type: Schema.ObjectId, ref: 'Usuario'},
    activo: Boolean
});

module.exports = mongoose.model('Auto', AutoSchema);