'use strict';

module.exports = async (req, res) => {
  return res.json({
    status: "OK",
    UP_STAGE: process.env.UP_STAGE
  })
};