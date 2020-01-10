'use strict';

import mongoose from 'mongoose';

const trend_schema = new mongoose.Schema({
  woeid: Number,
  time: Number,
  trends: Object
});

const Place = mongoose.model('Place', trend_schema, 'place');

async function setValue(obj) {
  const place = new Place(obj);
  place.save()
    .catch(error => console.log(error.message));
}

async function replaceValue(old_obj, new_obj) {
  return await Place.replaceOne(old_obj, new_obj);
}

async function getValues(time, woeid) {
  return await Place.find({time: { $gte: time }, woeid});
}


module.exports = {
  setValue,
  replaceValue,
  getValues
}


