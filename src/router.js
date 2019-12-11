'use strict';

const app = require('router')();
const body = require('body-parser');

app.use(require('./mid/json'));

app.get('/', require('./lambda/status'));

// Trends
app.get('/trends/place/:id', require('./lambda/trends/trends-near-location'));
app.get('/trends/places', require('./lambda/trends/get-locations'));

module.exports = app;

