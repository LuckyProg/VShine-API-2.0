'use strict'

var bcrypt = require('bcrypt-nodejs');

var Auto = require('../models/auto');
var Usuario = require('../models/usuario');

function registerAuto(req, res){
    var params = req.body;
    var usuarioId = req.user.sub_id;
    if(!req.params.id){
        return res.status(500).send({mensaje: 'Parametros incompletos'});
    }else{
        if(params.placa && params.modelo && params.color && params.marca){
            var auto = new Auto({
            placa: params.placa,
            modelo: params.modelo,
            color: params.color,
            marca: params.marca,
            enlavado: false,
            activo: true,
            });

            if(req.params.id == usuarioId){

                Auto.find({placa: auto.placa}).exec((err, autos)=>{
                    if(err){
                        return res.status(404).send({mensaje: 'Error al buscar duplicados'});
                    }else if(autos && autos.length >= 1){
                        console.log('hey');
                        return res.status(200).send({mensaje: 'Placa en uso'});
                    }else{
                        Usuario.findById(usuarioId, (err, userfound)=>{
                            if(err){
                                return res.status(500).send({mensaje: 'Error buscando usuario'});
                            }else if(!userfound){
                                return res.status(404).send({mensaje: 'El usuario no existe'});
                            }else{
                                auto.usuario = usuarioId;
                                auto.save((err, autoStored)=>{
                                    if(err){
                                        return res.status(500).sned({mensaje: 'Error en la petición'});
                                    }else if(!autoStored){
                                        return res.status(404).send({mensaje: 'Auto no guardados'});
                                    }else{
                                        return  res.status(200).send({auto: autoStored});
                                    }
        
                                });
        
                            }
                        });
                    }
                });

            }else{
                return res.status(500).send({mensaje: 'Acceso Denegado'});
            }

            
            
        }else{
            return res.status().send({mensaje: 'Datos incompletos'});
        }
    }
        

}

function updateAuto(){

}

function deleteAuto(){

}

module.exports = {
    registerAuto
};