var socket = io();

socket.on('connect', function() {
  console.log('event on html page :-)');

  socket.emit('createMessage', { "from": "hans@hiernl", "text": "Hi all!! What's up overthere?" })

});

socket.on('disconnect', function() {
  console.log('disconnected');
});

socket.on('newMessage', function(message) {
  console.log('en hier is ie dan: ', message);
});
