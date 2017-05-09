var socket = io();

socket.on('connect', function() {
  console.log('event on html page :-)');

});

socket.on('disconnect', function() {
  console.log('disconnected');
});

socket.on('newMessage', function(message) {
  console.log(message);

  var li = jQuery('<li></li>');
  li.text(message.from + ": " + message.text);
  jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', function(e) {
  console.log('in  onsubmit');
  e.preventDefault();

  socket.emit('createMessage', {
    "from": jQuery('#name').val(),
    "text": jQuery('[name = message]').val()
  }, function(acc) {
    console.log("message received by server");
  })
})
