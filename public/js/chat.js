var socket = io();
var timeMask = 'h:mm a'
var params;

function scrollToBottom() {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  var sum = clientHeight + scrollTop + newMessageHeight + lastMessageHeight;

  if (scrollHeight > clientHeight && clientHeight + scrollTop + newMessageHeight +
    lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight)
  };
};

socket.on('connect', function() {
  params = jQuery.deparam(window.location.search)

  socket.emit('join', params, function(error) {
    if (error) {
      alert(error);
      window.location.href = '/';
    }
  });
});

socket.on('updateUsersList', function(users) {

  users.sort();

  // create an ol and add a li for every user in list users
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  // add ol to div id='users'
  jQuery('#users').html(ol);

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
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {

  var time = moment(message.createdAt).format(timeMask);
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    'url': message.url,
    'from': message.from,
    'createdAt': time
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(f) {

  f.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    "text": messageTextbox.val()
  }, function(acc) {
    messageTextbox.val('');
  });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by this browser');
  }
  locationButton.attr(
    'disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      "latitude": position.coords.latitude,
      "longitude": position.coords.longitude
    });
  }, function() {
    alert('Not able to get location');
    locationButton.removeAttr('disabled').text('Send location');
  });
});
