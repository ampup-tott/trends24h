'use strict';

import firebase from '../helper/firebase';
import axios from 'axios';
import moment from 'moment';

import { format } from '../helper/format-tweet-volume';

module.exports = async (req, res, next) => {
  const place = req.body;
  
  const uri = `${process.env.HOST}/trends/place/${place.woeid}`;
  const dbpath = `trends/places/${place.woeid}/time`;
  let trends_day = await firebase.getValue(dbpath);
  let isCreate = false;
  let time_lastest_update = 0;
  if (trends_day.val()) {
    trends_day = Object.values(trends_day.val());
    isCreate = true;
    time_lastest_update = moment(trends_day[0].as_of).unix();
  }
  else {
    trends_day = []
  }
  while (trends_day.length < 24) {
    trends_day.push(null);
  }

  let current_trends = {};
  await axios.get(uri)
    .then(result => {
      const data = result.data.data[0];

      for (let j = 0; j < data.trends.length; j++) {
        data.trends[j] = { ...data.trends[j], tweet_volumes_fmt: format(data.trends[j].tweet_volume)}
      }

      current_trends = { ...data };
    })
    .catch(error => {
      console.log(error.message);
    });
  
  const time_up_comming = moment(current_trends.as_of).unix();
  if (time_up_comming - time_lastest_update >= 3600) {
    for (let j = trends_day.length - 1; j > 0; j--) {
      if (trends_day[j-1]) {
        trends_day[j] = {...trends_day[j-1]};
      }
      else {
        trends_day[j] = null;
      }
    }
    trends_day[0] = {...current_trends };
  }
  else {
    trends_day[0] = {...current_trends };
  }

  for (let j = 0; j < 24; j++) {
    if (trends_day[j] && isCreate) {
      firebase.updateValue(dbpath, j, {
        ...trends_day[j]
      })
    }
    else {
      if (trends_day[j] && !isCreate) {
        firebase.setValue(dbpath, {
          [j]: { ...trends_day[j] }
        })
      }
    }
  }
  res.json({
    status: 'OK'
  })
}