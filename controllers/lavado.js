'use strict'

var Auto = require('../models/auto');
var Usuario = require('../models/usuario');
var Lavado = require('../models/lavado');

function registerAuto(req, res){
    var usuarioid = req.params.id;
    if(!usuarioid){
        usuarioid = req.user.sub_id;
    }
    var params = req.body;
    if(params.direccion.latitud && params.direccion.longitud && params.fecha && params.tipo && params.pago && params.auto){
        var lavado = new Lavado({
            direccion: params.direccion,
            ubicacion:{
                latitud: params.ubicacion.latitud,
                longitud: params.ubicacion.longitud
            },
            fecha: params.fecha,
            tipo: params.tipo,
            estado: 'espera',
            usuario: usuarioid,
            auto: params.auto
        });
        //validar auto
        Auto.findById(lavado.auto, (err, autofound) => {
            if(err){
                return res.status(500).send({mensaje: 'Error en la solicitud'});
            }else if(!autofound || autofound.estado == 'enuso'){
                return res.status(404).send({mensaje: 'Auto no encontrado o en uso'});
            }else{
                //validar usuario
                Usuario.findById(lavado.usuario, (err, userfound) => {
                    if(err){
                        return res.status(500).send({mensaje: 'Error en la petición'});
                    }else if(!userfound){
                        return res.status(404).send({mensaje: 'Usuario no encontrado'});
                    }else{
                        lavado.save((err, lavadostored) => {
                            if(err){
                                return res.status(500).send({mensaje: 'Error al guardar lavado'});
                            }else{
                                return res.status(200).send({lavado: lavadostored});
                            }
                        });
                    }
                });
            }
        });
    }else{
        return res.status(500).send({mensaje: 'Datos incompletos'});
    }
    

    
}

function changeStatus(req, res){

}

module.exports = {
    registerAuto
};