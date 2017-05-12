const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log(`Hi new user!`);

  // to send to nobody but self
  var welcomeMessage = `Welcome in the chat!`;
  socket.emit('newMessage', generateMessage("Admin", welcomeMessage));

  // to send to everybody but self
  socket.broadcast.emit('newMessage', generateMessage("Admin", "New user joined"));

  // listen for incomming message and forward to all users
  socket.on('createMessage', (theMessage, callback) => {

    callback("Ok");

    // to send to everybody
    var message = generateMessage(theMessage.from, theMessage.text);
    io.emit('newMessage', message);
  });

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and Room must have a value');
    } else {
      callback();
    }
  });

  socket.on('createLocationMessage', (request) => {
    console.log(`location: ${JSON.stringify(request)}`);
    io.emit('newLocationMessage', generateLocationMessage(request.from, request.latitude,
      request.longitude));
    // io.emit('newLocationMessage', `https://google.com/maps?q=${location.latitude},${location.longitude}`);
  })

  socket.on('disconnect', () => {
    console.log('client was disconnected');
  })

})

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
