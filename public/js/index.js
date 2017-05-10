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

socket.on('newLocationMessage', function(message) {
  console.log('url: ', message.url);
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');
  li.text(message.from + ": ");
  a.attr('href', message.url);
  li.append(a);

  jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit', function(e) {
  console.log('in  onsubmit');
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    "from": jQuery('#name').val(),
    "text": messageTextbox.val()
  }, function(acc) {
    console.log("result on server: ", acc);
    messageTextbox.val('');
  })
})

var locationButton = jQuery('#send-location');

locationButton.on('click', function() {
  if(!navigator.geolocation) {
    return alert('Geolocation is not supported by this browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send location');
    console.log('Position: ', position.coords.latitude + ', ' + position.coords.longitude);
    socket.emit('createLocationMessage', {
      "latitude": position.coords.latitude,
      "longitude": position.coords.longitude
    })
  }, function() {
    alert('Not able to get location');
    locationButton.removeAttr('disabled').text('Send location');
  });
});
