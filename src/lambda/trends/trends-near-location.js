'use strict';

import { twit } from '../helper/twit';

module.exports = async (req, res, next) => {
  const { id } = req.params; // id is Place Id
  if (!id) {
    return next('Missing parameter: id');
  }
  
  try {
    twit.get('trends/place', { id }, (err, data, response) => {
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