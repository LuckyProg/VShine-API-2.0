'use strict'

var express = require('express');
var AutoController = require('../controllers/auto');
var mdauth = require('../middlewares/authenticated');

var api = express.Router();
api.post('/auto/:id', mdauth.ensureAuth, AutoController.registerAuto);

module.exports = api;