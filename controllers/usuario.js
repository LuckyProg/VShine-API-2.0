'use strict'
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/usuario');
var Auto = require('../models/auto');
var jwt = require('../services/jwt');


function login(req, res){
    var params = req.body;

    var correo = params.correo;
    var pass = params.pass;

    User.findOne({correo: correo}, (err, user) => {
        if(err) return res.status(500).send({mensaje: 'Error en la petición'});

        if(user){
            bcrypt.compare(pass, user.pass, (err, check) => {
                if(check){
                    if(params.token){
                        res.status(200).send({
                            token: jwt.crearToken(user)
                        });
                    }else{
                        user.pass = undefined;
                        res.status(200).send({usuario: user});
                    }
                }else{
                    res.status(404).send({mensaje: 'Usuario no se ha podido identificar'});
                }
            });
        }else{
            res.status(404).send({mensaje: 'Usuario no se ha podido identificar!!'});
        }
    });
}

function saveUser(req, res){
    var params = req.body;

    if(params.nombre && params.correo && params.celular && params.pass && params.placa && params.modelo &&  params.color && params.marca){

            var user = new User();
            user.nombre = params.nombre;
            user.correo = params.correo;
            user.celular = params.celular;

            var auto = new Auto({
                placa: params.placa,
                modelo: params.modelo,
                color: params.color,
                marca: params.marca,
            });

            //DUPLICADOS
            User.find({correo: user.correo}).exec((err, users) => {
                if(err){
                    res.status(500).send({mensaje: 'Error en la petición de usuarios'});
                }else if(users && users.length >= 1){
                    res.status(200).send({mensaje: 'El correo ingresado ya tiene una cuenta registrada'});
                }else{
                    Auto.find({placa: params.placa}).exec((err, autos) => {
                        if(err){
                            res.status().send({mensaje: 'Error en la petición de autos'});
                        }else if(autos && autos.length >= 1){
                            
                            res.status(200).send({mensaje: 'Placas ya registradas'});
                        }else{
                            bcrypt.hash(params.pass, null, null, (err, hash) => {
                                user.pass = hash;
                                user.save((err, userStored) => {
                                    if(err){
                                        res.status(500).send({mensaje: 'Error al guardar usuario'});
                                    }else if(userStored){
                                        auto.usuario = userStored._id;   
                                        auto.save((err)=>{
                                            if(err){
                                                res.status(500).send({mensaje: 'Error al guardar auto de usuario'});
                                            }else{
                                                res.status(200).send({usuario: userStored});
                                            }
                                        });
                                        
                                    }else{
                                        res.status(404).send({mensaje: 'No se ha registrado el usuario'});
                                    }
                                })
                            }); 
                        }
                    });
                }
                
                
            });


    }else{
        res.status(200).send({ mensaje: 'Datos incompletos para registrar usuario'});
    }


}

module.exports = {
    login,
    saveUser
}