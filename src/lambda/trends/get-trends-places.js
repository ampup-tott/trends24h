'use strict';

import firebase from '../helper/firebase';
import moment from 'moment';

module.exports = async (req, res, next) => {
  const { weoid } = req.params; // woeid of place: 
  let { time } = req.query; // time that you want to fetch

  const { api_key } = req.headers; // api_key need to access this api

  if (!api_key || (api_key !== process.env.API_KEY)) {
    res.statusCode = 403;
    return next('Forbinden');
  }

  if (!weoid) {
    return next('Missing parameter: weoid');
  }

  if (!time || !parseInt(time)) { // If haven't time ot wrong time
    time = moment().startOf('hour').unix() // Set time is current time
  }
  else {
    time = moment(time * 1000).utc().startOf('hour').unix(); // Set time follow request
  }
 
  let db_path = `trends/${weoid}/${time}`; // Path to db realtime
  let place_trend = await firebase.getValue(db_path); // Trend newest in db realtime
  if (place_trend.val()) {
    place_trend = { ...place_trend.val() };
  }
  else { // Not existed in db or not updated
    time = time - 3600;
    db_path = `trends/${weoid}/${time}`; // Path to db realtime
    place_trend = await firebase.getValue(db_path); // Trend newest in db realtime
    if (place_trend.val()) {
      place_trend = { ...place_trend.val() };
    }
    else {
      place_trend = {};
    }
  }

  let times = []; // slots time in day follow hour

  for (let i = 1; i < 24; i++) {
    times.push(`${time - (i * 3600) }`);
  } // set slot 1 hour ago -> 23 hours ago

  let data = await firebase.getValueFireStore('trends', `${weoid}`, times); // data of slots time in firestore

  if (data.length === 0) { // not existed in firestore
    return next('Wrong id or time!');
  } 

  return res.json({
    data: [place_trend, ...data]
  })
}