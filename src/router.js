'use strict';

const app = require('router')();
const body = require('body-parser');
const axios = require('axios');
const favicon = require('express-favicon');

app.use(require('./mid/json'));
app.use(favicon(__dirname + '.../public/favicon.ico'));

app.get('/', require('./lambda/status'));

// Trends
app.get('/trends/place/:id', require('./lambda/trends/trends-near-location'));
app.get('/trends/places', require('./lambda/trends/get-locations'));

// heart beat trends
app.post('/heart-beat-trends', require('./lambda/trends/heart-beat-trends'));

module.exports = app;

