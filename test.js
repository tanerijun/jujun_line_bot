let d = new Date(2022, 04, 16, 00, 00, 00).toUTCString();
let d2 = new Date();
var now = new Date();
var utc = new Date(
  now.getTime() + now.getTimezoneOffset() * 60000
).toUTCString();
console.log(d2.toUTCString());
console.log(d2.toString());
console.log(utc);
