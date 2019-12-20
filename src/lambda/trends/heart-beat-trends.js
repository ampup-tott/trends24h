'use strict';

import moment from 'moment';
import mongo from '../helper/mongo';
import Twit from 'twit';

module.exports = async (req, res, next) => {
  const { place, key } = req.body;

  const { api_key } = req.headers; // Need api_key to access this api

  if (!api_key || (api_key !== process.env.API_KEY)) {
    res.statusCode = 403;
    return next('Forbinden');
  }

  if (!place) {
    return next('Missing parameter: place');
  }

  if (!key || !parseInt(key)) {
    return next('Missing parameter: key');
  }

  const config = {
    consumer_key: process.env[`CONSUMER_KEY_${key}`],
    consumer_secret: process.env[`CONSUMER_SECRET_${key}`],
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    app_only_auth: true
  }; // Use keys for config

  const twit = new Twit(config);

  try {
    twit.get('trends/place', { id: `${place.woeid }` }, async (err, data, response) => {
      if (err) {
        return next(err.message);
      }
      
      let current_trends = data[0]; // trends of place if newest
      if (!current_trends) {
        return next('Error with key twitter')
      }
      
      let { as_of } = current_trends; // array trends newest

      const timestamp = moment(as_of).startOf('hour').unix(); // Ensure start of hour 7:00
      const updated = await mongo.replaceValue({ time: timestamp, woeid: place.woeid }, { woeid: place.woeid, time: timestamp, trends: current_trends });
      if (updated && updated.n) { // Updated
        console.log(`updated ${place.woeid}`);
      } 
      else { // new hour
        mongo.setValue({ woeid: place.woeid, time: timestamp, trends: current_trends });
      }
      return res.json({
        status: 'Ok',
        time: timestamp
      })
    })
  } catch(error) {
    return next(error.message);
  }
}