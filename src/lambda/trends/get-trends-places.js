'use strict';

import firebase from '../helper/firebase';

module.exports = async (req, res, next) => {
  const { weoid } = req.params;
  if (!weoid) {
    return next('Missing parameter: weoid');
  }
  const dbPath = `trends/places/${weoid}/time`;
  let data = await firebase.getValue(dbPath);
  if (data.val()) {
    data = Object.values(data.val());
  }
  else {
    return next('Wrong woeid!');
  }

  return res.json({
    data
  })
}