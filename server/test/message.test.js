const mocha = require('mocha');
const expect = require('expect');

const { generateMessage } = require('./../utils/message');

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

})
