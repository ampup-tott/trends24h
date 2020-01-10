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

async function getValues(woeid, time, limit) {
    if (!limit) {
      return Place.find({ time: { $gte: time }, woeid }).limit(24);
    }
    else {
      return Place.find({ time: { $gte: time }, woeid }).limit(limit);
    }
}

async function getValue(woeid, time) {
  return await Place.findOne({ time, woeid });
}


async function removeValue(obj) {
  console.log('move', obj);
  await Place.deleteOne(obj);
}

module.exports = {
  setValue,
  replaceValue,
  getValues,
  removeValue,
  getValue
}


