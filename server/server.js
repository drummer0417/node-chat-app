const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// general emits versus room emits
// io.emit --> io.to('the room name').emit;
// socket.broadcast.emit --> socket.broadcast.to('the room name');
// socket.emit (no changes needed)

io.on('connection', (socket) => {

  socket.on('getRoomList', (callback) => {
    console.log('In getRoomList');
    callback(users.getRoomList());
  });

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and Room must have a value');
    } else if(users.exists(params.name, params.room)) {
      callback(`User name "${params.name} / ${params.room}" already exists`);
    } else {

      socket.join(params.room);

      // remove user from this or other lists first
      users.removeUser(socket.id);
      // add user to room
      users.addUser(socket.id, params.name, params.room);
      console.log('All users: --------------------------------------------\n', JSON.stringify(
        users.users, undefined, 2));

      io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

      // socket.leave('the room name);

      // to send to nobody but self
      var welcomeMessage = `Hi ${params.name}, welcome in the chat!`;
      socket.emit('newMessage', generateMessage(params.room, welcomeMessage));

      // to send to everybody in the room but self
      socket.broadcast.to(params.room).emit('newMessage', generateMessage(params.room,
        `${params.name} joined the chat`));

      callback();
    };
  });

  // listen for incomming message and forward to all users
  socket.on('createMessage', (theMessage, callback) => {

    callback("Ok");

    // to send to everybody
    if(isRealString(theMessage.text)) {
      var user = users.getUser(socket.id);
      if(user) {
        io.to(user.room).emit('newMessage', generateMessage(
          user.name, theMessage.text));
      };
    };
  });

  socket.on('createLocationMessage', (request) => {
    var user = users.getUser(socket.id);
    if(user) {
      io.to(user.room).emit('newLocationMessage',
        generateLocationMessage(user.name, request.latitude, request.longitude));
    };
  });

  socket.on('disconnect', () => {
    console.log('client was disconnected');

    var leavingUser = users.removeUser(socket.id);
    if(leavingUser) {
      io.to(leavingUser.room).emit('updateUsersList', users.getUserList(leavingUser.room));
      io.to(leavingUser.room).emit('newMessage', generateMessage(leavingUser.room,
        `${leavingUser.name} has left the chat`));
    };
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
