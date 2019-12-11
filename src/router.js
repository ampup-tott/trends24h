'use strict';

const app = require('router')();
const body = require('body-parser');

app.use(require('./mid/json'));

app.get('/', require('./lambda/status'));

module.exports = app;

