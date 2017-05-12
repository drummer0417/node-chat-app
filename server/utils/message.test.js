const mocha = require('mocha');
const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./../utils/message');

describe('UTILS generateMessage', () => {

  it('Should create a valid message', () => {

    // var message = {
    //   "from": "hans@now.nl",
    //   "text": "this is the text",
    //   "createdAt": 3243423
    // };
    var generatedMessage = generateMessage("hans@now.nl", "this is the text");

    expect(generatedMessage).toContain({ "from": "hans@now.nl", "text": "this is the text" });
    expect(generatedMessage.createdAt).toBeA('number');
  })

});

describe('UTILS generateLocationMessage', () => {

  it('Should generaete a correct loocation message', () => {
    var url = "https://google.com/maps?q=54.123,5.123";
    var lat = "54.123";
    var lon = "5.123"
    var from = "Admin"
    var generatedLocationMessage = generateLocationMessage(from, lat, lon); -
    expect(generatedLocationMessage).toInclude({ from, url });
    expect(generatedLocationMessage.createdAt).toBeA('number');
  })

});
