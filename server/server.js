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
    var message = { "from": theMessage.from, "text": theMessage.text, "createdAt": new Date() };
    io.emit('newMessage', message);

  });

  // socket.emit('newMessage', { "text": "the message text...... " });

})

server.listen(port, () => {
  console.log(`Server started on port ${port} `);
})
