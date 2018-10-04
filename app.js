'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//CARGAR RUTAS
var usuario_routes = require('./routes/user');
var auto_routes = require('./routes/auto');

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//CORS

//RUTAS
app.use('/api', usuario_routes);
app.use('/api', auto_routes);

//EXPORTS
module.exports = app;