'use strict'

var express = require('express');
var UserController = require('../controllers/usuario');
var mdauth = require('../middlewares/authenticated');

var api = express.Router();
api.post('/login', UserController.login);
api.post('/register', UserController.saveUser);
api.get('/prueba', mdauth.ensureAuth, UserController.prueba);
api.get('/usuario/:id', mdauth.ensureAuth, UserController.getUser);
api.get('/usuarios/:page?', mdauth.ensureAuth, UserController.getUsers);
api.put('/updateUser/:id', mdauth.ensureAuth, UserController.editUser);
api.delete('/deleteUser/:id', mdauth.ensureAuth, UserController.deleteUser);

module.exports = api;