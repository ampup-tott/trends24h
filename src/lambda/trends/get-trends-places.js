'use strict';

import moment from 'moment';
import mongo from '../helper/mongo';
import cache from '../helper/cache';

module.exports = async (req, res, next) => {
  const { weoid } = req.params; // woeid of place: 
  let { time, trends } = req.query; // time that you want to fetch

  const { api_key } = req.headers; // api_key need to access this api

  if (!api_key || (api_key !== process.env.API_KEY)) {
    res.statusCode = 403;
    return next('Forbinden');
  }

  if (!weoid) {
    return next('Missing parameter: weoid');
  }

  if (!trends && !parseInt(trends)) {
    trends = 50;
  }

  if (!time || !parseInt(time)) { // If haven't time ot wrong time
    time = moment().startOf('hour').unix() // Set time is current time
  }
  else {
    time = moment(time * 1000).utc().startOf('hour').unix(); // Set time follow request
  }

  const key_cache = `place-${weoid}-${time}-${trends}`;
  const data_cache = await cache.getCache(key_cache);
  
  if (data_cache) {
    return res.json({
      data: JSON.parse(data_cache)
    })
  }
  
  let result = await mongo.getValues(time - (23 * 3600), weoid);

  result.sort((a, b) => {
    return b.time - a.time;
  })
  
  result = result.map(place => {
    return place.trends;
  });

  if (trends < 50) {
    result = result.map(trend => {
      let slice_trends = trend.trends.slice(0, trends);
      return { ...trend, trends: slice_trends };
    })
  }

  cache.setCache(key_cache, JSON.stringify(result), 5 * 60);

  return res.json({
    data: result
  })
}