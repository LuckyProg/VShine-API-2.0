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

    //Buscar usuario
    User.findOne({correo: correo}, (err, user) => {
        if(err){
            //Error buscar usuario
            return res.status(500).send({mensaje: 'Error buscar usuario'});
        }else if(user){
            //Usuario encontrado
            bcrypt.compare(pass, user.pass, (err, check) => {
                if(check){
                    //Contraseña correcta
                    
                    if(params.token){
                        //Pide token
                        res.status(200).send({
                            token: jwt.crearToken(user)
                        });
                    }else{
                        //No pide token
                        user.pass = undefined;
                        res.status(200).send({usuario: user});
                    }
                }else{
                    //Error datos incorrectos
                    res.status(404).send({mensaje: 'Error datos incorrectos'});
                }
            });
        }else{
            //Error datos incorrectos
            res.status(404).send({mensaje: 'Error datos incorrectos'});
        }
    });
}

function saveUser(req, res){
    var params = req.body;
    if(params.nombre && params.correo && params.celular && params.pass && params.placa && params.modelo && params.color && params.marca){
        

        var auto = new Auto({
            placa: params.placa,
            modelo: params.modelo,
            color: params.color,
            marca: params.marca,
            enlavado: false,
            activo: true
        });

        var user = new User({
            nombre: params.nombre,
            correo: params.correo,
            celular: params.celular,
            role: "usuario",
            activo: true
        });

        //Buscar auto
        Auto.find({placa: auto.placa}).exec((err, autos) => {
            if(err){
                //Error buscar auto
                return res.status(404).send({mensaje: 'Error buscar auto'});
            }else if(autos && autos.length >= 1){
                //Error     uplicado
                return res.status(200).send({mensaje: 'Error auto duplicado'});
            }else{
                //Auto nuevo

                //Buscar usuario
                User.find({correo: user.correo}).exec((err, users) => {
                    if(err){
                        //Error buscar usuario
                        return res.status(500).send({mensaje: 'Error buscar usuario'});
                    }else if(users && users.length >= 1){
                        //Error usuario duplicado
                        return res.status(200).send({mensaje: 'Error usuario duplicado'});
                    }else{
                        //Usuario nuevo
                        //Cifrar pass
                        bcrypt.hash(params.pass, null, null, (err, hash) => {
                            user.pass = hash;
                            //Guardar usuario
                            user.save((err, userStored) => {
                                if(err){
                                    //Error guardar usuario
                                    return res.status(500).send({mensaje: 'Error al guardar usuario'});
                                }else{
                                    //Usuario guardado
                                    auto.usuario = userStored._id;
                                    //Guardar auto
                                    auto.save((err, autoStored) => {
                                        if(err){
                                            //Error guardar auto
                                            return res.status(500).send({mensaje: 'Error guardar auto'});
                                        }else{
                                            //Auto guardado
                                            userStored.pass = undefined;
                                            userStored.__v = undefined;
                                            userStored.activo = undefined;
                                            auto.__v = undefined;
                                            auto.enlavado = undefined;
                                            auto.activo = undefined;
                                            return res.status(200).send({
                                                usuario: userStored,
                                                auto: autoStored
                                            });
                                            
                                        }
                                    });
                                }
                            });;
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

    if(req.user.role != 'admin'){
        return res.status(500).send({mensaje: 'Acceso Denegado'});
    }else{
        var page = 1;
        if(req.params.page){
            page = req.params.page;
        }

        var itemPerPage = 5;
        //Buscar usuarios
        User.find().select('nombre role correo celular activo').sort('_id').paginate(page, itemPerPage, (err, users, total) => {
            if(err){
                //Error buscar usuarios
                return res.status(500).send({mensaje: 'Error buscar usuarios'});
            }else if(!users){
                //Error no hay usuarios
                return res.status(404).send({mensaje: 'Error no hay usuarios'});
            }else if(users && users.length >= 1){
                //Usuarios encontrados y paginados
                return res.status(200).send({users, total, pages: Math.ceil(total/itemPerPage)});
            }else{
                //Error pagina no encontrada
                return res.status(404).send({mensaje: 'Error pagina no encontrada'});
            }
        });
    }
    
}

function getUser(req, res){
    var userId = req.params.id;
    
    if(req.user.sub_id == req.params.id || req.user.role == 'admin'){
        //Buscar usuario
        User.findById(userId, (err, user) => {
            if(err){
                //Error buscando usuario
                return res.status(500).send({mensaje: 'Error buscando usuario'});
            }else if(!user){
                //Error usuario no existe
                return res.status(404).send({mensaje: 'Error usuario no existe'});
            }else{
                //Usuario encontrado
                user.pass = undefined;
                return res.status(200).send({user});
            }
        });
    }else{
        return res.status(500).send({mensaje: 'Acceso Denegado'});
    }
    
}

function editUser(req, res){

    if(req.user.sub_id == req.params.id || req.user.role == 'admin'){
        var userId = req.params.id;
        var update = req.body;
        //Prevee acualizar pass para hacerlo en otro método
        delete update.pass;
        delete update.activo;
        delete update.role;

        //Buscar y actualizar
        User.findOneAndUpdate(userId, update, {new: true},(err, userUpdated) => {
            if(err){
                //Error actualizaar usuario
                return res.status(500).send({mensaje: 'Error actualizar usuario'});
            }else if(!userUpdated){
                //Error usuario no actualizado
                return res.status(404).send({mensaje: 'Error usuario no actualizado'});
            }else{
                //Usuario actualizado
                userUpdated.pass = undefined;
                return res.status(200).send({user: userUpdated});
            }
        });
        
    }else{
        return res.status(500).send({mensaje: 'Acceso Denegado'});
    }

    
}

function deleteUser(req, res){
    if(req.user.sub_id == req.params.id || req.user.role == 'admin'){
        var userId = req.params.id;

        var update = {
            activo: false
        };
        

        //Buscar y actualizar
        User.findOneAndUpdate(userId, update, {new: true},(err, userUpdated) => {
            if(err){
                //Error actualizaar usuario
                return res.status(500).send({mensaje: 'Error actualizar usuario'});
            }else if(!userUpdated){
                //Error usuario no actualizado
                return res.status(404).send({mensaje: 'Error usuario no actualizado'});
            }else{
                //Usuario actualizado
                userUpdated.pass = undefined;
                return res.status(200).send({user: userUpdated});
            }
        });
        
    }else{
        return res.status(500).send({mensaje: 'Acceso Denegado'});
    }
}

function prueba(req, res){
    res.status(200).send({mensaje: 'hola'});
}

module.exports = {
    login,
    saveUser,
    prueba,
    getUsers,
    getUser,
    editUser,
    deleteUser
}