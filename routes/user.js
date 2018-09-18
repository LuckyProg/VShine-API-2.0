'use strict'

var express = require('express');
var UserController = require('../controllers/usuario');

var api = express.Router();
api.post('/login', UserController.login);
api.post('/register', UserController.saveUser);

module.exports = api;