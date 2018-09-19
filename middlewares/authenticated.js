'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '01123581321';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.auth){
        res.status(403).send({mensaje: 'La petición no tiene cabezera de autentificación'});
    }else{
        var token = req.headers.auth.replace(/['"]+/g, '');
        try {
            var payload = jwt.decode(token, secret);
            if(payload.expiracion <= moment().unix()){
               return res.status(401).send({mensaje: 'Token ha expirado'});
            }
        } catch (ex) {
            return res.status(405).send({mensaje: 'El token no es válido'});
        }
        req.user = payload;
        console.log(payload);
        next();
    }

};