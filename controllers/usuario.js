'use stinct'
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/usuario');
var Auto = require('../models/auto');


function login(req, res){
    res.status(200).send({
        mensaje: 'hola desde usuario'
    });
}

function saveUser(req, res){
    var params = req.body;

    if(params.nombre &&
        params.correo &&
        params.celular &&
        params.pass &&
        params.placa &&
        params.modelo && 
        params.color &&
        params.marca){

            var user = new User();
            user.nombre = params.nombre;
            user.correo = params.correo;
            user.celular = params.celular;
            bcrypt.hash(params.pass, null, null, (err, hash) => {
                user.pass = hash;
                user.save((err, userStored) => {
                    if(err) return res.status(500).send({mensaje: 'Erorr al guardar usuario'});
                    if(userStored){
                        var auto = new Auto({
                            placa: params.placa,
                            modelo: params.modelo,
                            color: params.color,
                            marca: params.marca,
                            usuario: userStored._id
                        });
                        auto.save((err)=>{
                            if(err) return res.status(500).send({mensaje: 'Error al guardar auto de usuario'});
                        });
                        res.status(200).send({usuario: userStored});
                    }else{
                        res.status(404).send({mensaje: 'No se ha registrado el usuario'});
                    }
                })
            }); 
            
            
                       
            


    }else{
        res.status(200).send({
            mensaje: 'Datos incompletos para registrar usuario'
        });
    }


}

module.exports = {
    login,
    saveUser
}