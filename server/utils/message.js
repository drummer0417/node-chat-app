var moment = require('moment');

var generateMessage = (from, text) => {
  return {
    "from": from,
    "text": text,
    "createdAt": moment().valueOf()
  }
}

var generateLocationMessage = (from, lat, lon) => {
  return {
    "from": from,
    "url": `https://google.com/maps?q=${lat},${lon}`,
    "createdAt": moment().valueOf()
  }
}
module.exports = { generateMessage, generateLocationMessage };
