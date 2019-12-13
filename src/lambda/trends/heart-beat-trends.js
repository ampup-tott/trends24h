'use strict';

import firebase from '../helper/firebase';
import axios from 'axios';
import moment from 'moment';

import { format } from '../helper/format-tweet-volume';

module.exports = async (req, res, next) => {
  const place = req.body;
  
  const uri = `${process.env.HOST}/trends/place/${place.woeid}`;
  let current_trends = {};

  await axios.get(uri)
    .then(result => {
      const data = result.data.data[0];
      current_trends = { ...data };
    })
    .catch(error => {
      console.log(error.message);
    });
    
  const { as_of } = current_trends;
  const timestamp = moment(as_of).startOf('hour').unix();
  
  firebase.updateValueFirestore('trends', `${place.woeid}`, `${timestamp}`, current_trends);
  
  res.json({
    status: 'OK',
    as_of
  })
}