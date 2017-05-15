var socket = io();

socket.emit('getRoomList', function(rooms) {

  var roomslist = jQuery('<datalist id="optionslist"></datalist>');
  rooms.sort();

  rooms.forEach(function(room) {
    var option = jQuery('<option/>').attr('value', room);
    roomslist.append(option);
  })
  // add roomslist to div id='roomslist'
  jQuery('#roomslist').html(roomslist);
  console.log('roomslist ======> ', roomslist);
});
