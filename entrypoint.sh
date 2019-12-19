#!/bin/bash

if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=development
fi

cp -r -L /tmp/package/node_modules /usr/src/app/node_modules
cd /usr/src/app
npm start
