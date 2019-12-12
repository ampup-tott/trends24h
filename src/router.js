'use strict';

const app = require('router')();
const body = require('body-parser');
const favicon = require('express-favicon');

app.use(body.json({ limit: '50mb' }));
app.use(require('./mid/json'));
app.use(require('./mid/query'));
app.use(favicon(__dirname + '.../public/favicon.ico'));

app.get('/', require('./lambda/status'));

// Trends
app.get('/trends/place/:id', require('./lambda/trends/trends-near-location'));
app.get('/trends/places', require('./lambda/trends/get-locations'));
app.get('/trends/:weoid', require('./lambda/trends/get-trends-places'));

// heart beat trends
app.post('/heart-beat-trends', require('./lambda/trends/heart-beat-trends'));

module.exports = app;

