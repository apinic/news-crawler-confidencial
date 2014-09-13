var schedule = require('node-schedule');
var action = require('./action');

var count = 0;

var j = schedule.scheduleJob('*/1 * * * *', function() {
  action.request();
  count++;
});

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('' + count);
}).listen(process.env.PORT || 5000);
