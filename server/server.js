const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log(`Hi new user!`);

  socket.on('disconnect', () => {
    console.log('client was disconnected');
  })

  // listen for incomming message and forward to all users
  socket.on('createMessage', (theMessage, callback) => {
    console.log('incomming message: ', theMessage);
    if (callback) {
      callback("Ok");
    }
    // to send to nobody but self
    var welcomeMessage = `Hi ${theMessage.from}, welkom in the chat!`;
    socket.emit('newMessage', generateMessage("Admin", welcomeMessage));

    // to send to everybody but self
    socket.broadcast.emit('newMessage', generateMessage("Admin", "New user joined"));

    // to send to everybody
    var message = generateMessage(theMessage.from, theMessage.text);
    io.emit('newMessage', message);
  });

  socket.on('createLocationMessage', (location) => {
    console.log(`location: ${JSON.stringify(location)}`);
    io.emit('newLocationMessage', generateLocationMessage("Admin", location.latitude,
      location.longitude));
    // io.emit('newLocationMessage', `https://google.com/maps?q=${location.latitude},${location.longitude}`);
  })
})

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
