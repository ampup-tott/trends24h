'use strict'

const url = require('url')
const qs = require('querystring')

module.exports = (req, res, next) => {
  req.query = qs.parse(url.parse(req.url).query)
  next()
}