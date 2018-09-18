'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '01123581321';

exports.crearToken = function(user){
    var payload = {
        sub: user._id,
        nombre: user.nombre,
        correo: user.correo,
        celular: user.celular,
        creacion: moment().unix(),
        expiracion: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);
};