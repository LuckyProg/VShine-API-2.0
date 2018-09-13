'use stinct'

var User = require('../models/usuario');


function login(req, res){
    res.status(200).send({
        mensaje: 'hola desde usuario'
    });
}

module.exports = {
    login
}