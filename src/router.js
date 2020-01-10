'use strict';

const app = require('router')();
const body = require('body-parser');
const cors = require('cors');

app.use(body.json({ limit: '50mb' }));
app.use(require('./mid/json'));
app.use(require('./mid/query'));
app.use(cors());
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err.message));

app.get('/', require('./lambda/status'));

// Trends
app.get('/trends/:weoid', require('./lambda/trends/get-trends-places'));

// heart beat trends
app.post('/heart-beat-trends', require('./lambda/trends/heart-beat-trends'));

module.exports = app;

