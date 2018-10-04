'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3800;

//CONEXION DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/vshine', {useMongoClient: true}).then(() => {
    console.log('Base de datos conectada');
    //CREAR SERVER
    app.listen(port, () => {
        console.log('Servidor corriendo en puerto: '+ port);
    });
}).catch(err => console.log(err));