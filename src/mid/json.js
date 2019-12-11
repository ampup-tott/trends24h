'use strict';

module.exports = (req, res, next) => {
  res.json = obj => {
    res.statusCode = res.statusCode || 200;
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.end(JSON.stringify(obj, null, 4));
  };
  next();
};