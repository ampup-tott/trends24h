'use strict';

import firebase from '../helper/firebase';
import axios from 'axios';
import { format } from '../helper/format-tweet-volume';

module.exports = async (req, res, next) => {
  const data = await firebase.getValue('places');
  const places = Object.values(data.val());
  for (let i = 0; i < 10; i++) {
    const uri = `${process.env.HOST}/trends/place/${places[i].woeid}`;
    const dbpath = `trends/places/${places[i].woeid}/time`;
    let trends_day = await firebase.getValue(dbpath);
    let isCreate = false;
    if (trends_day.val()) {
      trends_day = Object.values(trends_day.val());
      isCreate = true;
    }
    else {
      trends_day = []
    }
    while (trends_day.length < 24) {
      trends_day.push(null);
    }

    for (let j = trends_day.length - 1; j > 0; j--) {
      if (trends_day[j-1]) {
        trends_day[j] = {...trends_day[j-1]};
      }
      else {
        trends_day[j] = null;
      }
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

    trends_day[0] = { ...current_trends };
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
  }
  res.json({
    status: 'OK'
  })
}