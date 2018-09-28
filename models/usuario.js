'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    correo: String,
    celular: String,
    pass: String,
    activo: Boolean

});

module.exports = mongoose.model('Usuario', UsuarioSchema);