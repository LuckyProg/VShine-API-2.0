'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoose_paginate = require('mongoose-pagination');

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
                    return res.status(500).send({mensaje: 'Error en la petición de usuarios'});
                }else if(users && users.length >= 1){
                    return res.status(200).send({mensaje: 'El correo ingresado ya tiene una cuenta registrada'});
                }else{
                    Auto.find({placa: params.placa}).exec((err, autos) => {
                        if(err){
                            return res.status().send({mensaje: 'Error en la petición de autos'});
                        }else if(autos && autos.length >= 1){
                            
                            return res.status(200).send({mensaje: 'Placas ya registradas'});
                        }else{
                            bcrypt.hash(params.pass, null, null, (err, hash) => {
                                user.pass = hash;
                                user.save((err, userStored) => {
                                    if(err){
                                        return res.status(500).send({mensaje: 'Error al guardar usuario'});
                                    }else if(userStored){
                                        auto.usuario = userStored._id;   
                                        auto.save((err)=>{
                                            if(err){
                                                return res.status(500).send({mensaje: 'Error al guardar auto de usuario'});
                                            }else{
                                                return res.status(200).send({usuario: userStored});
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

function getUsers(req, res){
    console.log(1);
    var identity_user_id = req.user.sub;
    console.log(2);
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    var itemPerPage = 5;
    User.find().sort('_id').paginate(page, itemPerPage, (err, users, total) => {
        if(err){
            return res.status(500).send({mensaje: 'Error en la petición'});
        }else if(!users){
            return res.status(404).send({mensaje: 'No hay ningún usuario registrado'});
        }else if(users && users.length >= 1){
            return res.status(200).send({users, total, pages: Math.ci(total/itemPerPage)});
        }else{
            return res.status(404).send({mensaje: 'Página no encontrada'});
        }
    });
}

function getUser(req, res){
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if(err){
            return res.status(500).send({err});
        }else if(!user){
            return res.status(404).send({mensaje: 'El usuario no existe'});
        }else{
            return res.status(200).send({user});
        }
    });
}

function prueba(req, res){
    res.status(200).send({mensaje: 'hola'});
}

module.exports = {
    login,
    saveUser,
    prueba,
    getUsers,
    getUser
}