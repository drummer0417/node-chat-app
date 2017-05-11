var socket = io();
var timeMask = 'h:mm a'
socket.on('connect', function() {
  console.log('event on html page :-)');

});

socket.on('disconnect', function() {
  console.log('disconnected');
});

socket.on('newMessage', function(message) {

  var time = moment(message.createdAt).format(timeMask);
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    'text': message.text,
    'from': message.from,
    'createdAt': time
  });

  jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(message) {

  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current location</a>');

  // li.text(time + " " + message.from + ": ");
  // a.attr('href', message.url);
  // li.append(a);
  var time = moment(message.createdAt).format(timeMask);
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    'url': message.url,
    'from': message.from,
    'createdAt': time
  })
  jQuery('#messages').append(html);
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
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by this browser');
  }
  locationButton.attr(
    'disabled', 'disabled').text('Sending location...');

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
