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

  const db_path = `trends/${weoid}/${time}`;
  let place_trend = await firebase.getValue(db_path);
  if (place_trend.val()) {
    place_trend = { ...place_trend.val() };
  }
  else {
    place_trend = {};
  }

  let times = [];

  for (let i = 1; i < 24; i++) {
    times.push(`${time - (i * 3600) }`);
  }

  let data = await firebase.getValueFireStore('trends', `${weoid}`, times);

  if (data.length === 0) {
    return next('Wrong id or time!');
  }

  return res.json({
    data: [place_trend, ...data]
  })
}