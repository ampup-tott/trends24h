'use strict';

const app = require('router')();
const body = require('body-parser');
const favicon = require('express-favicon');

app.use(body.json({ limit: '50mb' }));
app.use(require('./mid/json'));
app.use(require('./mid/query'));
app.use(favicon(__dirname + '.../public/favicon.ico'));

app.get('/', require('./lambda/status'));

// init || reset
app.post('/reset-db', require('./lambda/trends/init-database'));

// Trends
app.get('/trends/:weoid', require('./lambda/trends/get-trends-places'));

// heart beat trends
app.post('/heart-beat-trends', require('./lambda/trends/heart-beat-trends'));

module.exports = app;

