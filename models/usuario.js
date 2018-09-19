'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    correo: String,
    celular: String,
    pass: String,
    autos: [{type: Schema.ObjectId, ref: 'Usuario'}]

});

module.exports = mongoose.model('Usuario', UsuarioSchema);