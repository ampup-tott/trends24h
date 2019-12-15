'use strict';

require('dotenv').config({ silent: true });
const { PORT = 8080 } = process.env;
const server = require('./build/server');

server.listen(PORT, () => {
  console.log(`ENDPOINT: ${process.env.HOST}:${PORT}`); // eslint-disable-line
  console.log(`ENVIROMENT: ${process.env.UP_STAGE}`); // eslint-disable-line
});