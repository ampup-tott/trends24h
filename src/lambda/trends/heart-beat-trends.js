'use strict';

import moment from 'moment';
import firebase from '../helper/firebase';
import Twit from 'twit';

module.exports = async (req, res, next) => {
  const { place, key, amount_trends } = req.body;

  const { api_key } = req.headers;

  if (!api_key || (api_key !== process.env.API_KEY)) {
    res.statusCode = 403;
    return next('Forbinden');
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
        next(err.message);
        res.json('err');
      }
      
      let current_trends = data[0];
      let { as_of, trends } = current_trends; // Trends newest
      trends = trends.slice(0, amount_trends); // Limit trends
      current_trends = {
        ...current_trends,
        trends: trends
      };

      const timestamp = moment(as_of).startOf('hour').unix(); // Ensure start of hour

      const db_path = `trends/${place.woeid}`; // Path to db
      const lastest_trend = await firebase.getValue(`${db_path}/${timestamp}`); // Trend in realtime db. Only save newest trend for place
      
      if (lastest_trend.val()) {
        firebase.updateValue(db_path, `${timestamp}`, current_trends);
        console.log('realtime & firestore')
        res.json({
          status: 'OK',
          as_of
        })
      }
      else { // Not existed: (different hour or data isn't created)
        const trend_updated = await firebase.getValue(`${db_path}/${timestamp - 3600}`); // check trend for 1 hour ago
        if (trend_updated.val()) {
          firebase.updateValueFirestore('trends', `${place.woeid}`, `${timestamp - 3600}`, trend_updated.val());
          // move to firestore (Firestore will save 1 hour ago -> older)
        }
        firebase.updateValue(db_path, `${timestamp}`, current_trends);
        console.log('realtime')
        res.json({
          status: 'OK',
          db: 'realtime'
        })
      }
    })
  } catch(error) {
    return next(error.message)
  }
}