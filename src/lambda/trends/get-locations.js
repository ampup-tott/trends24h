'use strict';

import { twit } from '../helper/twit';

module.exports = async (req, res, next) => {
  try {
    twit.get('trends/available', (err, data, response) => {
      if (err) {
        return next(err.message);
      }
      else {
        return res.json({
          status: "OK",
          data
        })
      }
    })
  } catch(error) {
    return next(error.message)
  }
}