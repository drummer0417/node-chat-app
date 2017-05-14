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

  if(scrollHeight > clientHeight && clientHeight + scrollTop + newMessageHeight +
    lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight)
  };
};

socket.on('connect', function() {
  params = jQuery.deparam(window.location.search)

  socket.emit('join', params, function(error) {
    if(error) {
      alert(error);
      window.location.href = '/';
    } else {
      console.log('no error in params');
    }
  })

});

socket.on('updateUsersList', function(users) {
  console.log('users list: ', users);

  // create an ol and add a li for every user in list users
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  })
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
  scrollToBottom();
})

jQuery('#message-form').on('submit', function(e) {
  console.log('in  onsubmit');
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    "from": params.name,
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
  locationButton.attr(
    'disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send location');
    console.log('Position: ', position.coords.latitude + ', ' + position.coords.longitude);
    socket.emit('createLocationMessage', {
      "from": params.name,
      "latitude": position.coords.latitude,
      "longitude": position.coords.longitude
    })
  }, function() {
    alert('Not able to get location');
    locationButton.removeAttr('disabled').text('Send location');
  });
});
