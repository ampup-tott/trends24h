'use strict';

module.exports = {
  format: function(number) {
    if (!number) {
      return null;
    } 

      number = parseInt(number);
    if (isNaN(number) || number < 900) {
      return null;
    };

    return Math.round(number / 1000) + 'K';

  }
}