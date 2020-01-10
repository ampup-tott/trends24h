'use strict';

import mongoose from 'mongoose';

const trend_schema = new mongoose.Schema({
  woeid: Number,
  time: Number,
  trends: Object
});

const Backup = mongoose.model('Backup', trend_schema, 'backup_place');

async function setValue(obj) {
  const backup = new Backup(obj);
  backup.save()
    .catch(error => console.log(error.message));
}

async function replaceValue(old_obj, new_obj) {
  return await Backup.replaceOne(old_obj, new_obj);
}

module.exports = {
  setValue,
  replaceValue
}


