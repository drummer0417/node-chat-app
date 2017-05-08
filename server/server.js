const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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
  socket.on('createMessage', function(theMessage) {
    console.log('incomming message: ', theMessage);

    // to send to nobody but self
    var welcomeMessage = `Hi ${theMessage.from}, welkom in the chat!`;
    console.log(welcomeMessage);
    socket.emit('newMessage', { "from": "Admin", "text": welcomeMessage, "createdAt": new Date().getTime() });

    // to send to everybody but self
    socket.broadcast.emit('newMessage', { "from": "Admin", "Text": "New user joined", "createdAt": new Date().getTime() });

    // to send to everybody
    var message = { "from": theMessage.from, "text": theMessage.text, "createdAt": new Date().getTime() };
    io.emit('newMessage', message);


  });
})

server.listen(port, () => {
  console.log(`Server started on port ${port} `);
})
