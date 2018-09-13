'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    correo: String,
    celular: String,
    pass: String
});

module.exports = mongoose.model('Usuario', UsuarioSchema);