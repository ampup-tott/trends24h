'use strict';

import firebase from '../helper/firebase';
import moment from 'moment';

module.exports = async (req, res, next) => {
  const { weoid } = req.params;
  let { time } = req.query;

  if (!weoid) {
    return next('Missing parameter: weoid');
  }

  if (!time || !parseInt(time)) {
    time = moment().startOf('hour').unix()
  }
  else {
    time = moment(time * 1000).utc().startOf('hour').unix();
  }

  const times = [];
  for (let i = 0; i < 23; i++) {
    times.push(`${time - (i * 3600) }`);
  }

  let data = await firebase.getValueFireStore('trends', `${weoid}`, times);

  if (data.length == 0) {
    return next('Wrong id or time!');
  }

  return res.json({
    data
  })
}