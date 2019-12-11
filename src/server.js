'use strict';

const http = require('http');
const finalhandler = require('finalhandler');
const router = require('./router');

const server = http.createServer((req, res) => {
  router(req, res, finalhandler(req, res))
});

module.exports = server;
