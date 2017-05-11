const moment = require('moment');

// var date = new Date();
// console.log(date.getMonth());

var date = moment();

date.subtract(210, 'minutes');
console.log(date.format('MMM Do YYYY'));

console.log(date.format('H:mm a'))

var date2 = moment();
console.log(date2);
console.log(new Date().getTime());
