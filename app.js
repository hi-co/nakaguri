var express = require('express');
var app = express();

app.get('/', function (req, res) {

  if (req['query']['callback'] === undefined) {
    var execSync = require('child_process').execSync;
    var result = "" + execSync('phantomjs --disk-cache=false --web-security=no --ignore-ssl-errors=yes netsniff.js ' + req['query']['url']);

    res.type('application/json');
    res.send(result);
  } else {
    res.send('complete');
    var exec = require('child_process').exec, child;
    child = exec('phantomjs --disk-cache=false --web-security=no --ignore-ssl-errors=yes netsniff.js ' + req['query']['url'],
      {maxBuffer: 400*1024},
      function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }

        var request = require('request');
        var options = {
          uri: req['query']['callback'],
          form: { name: stdout },
          json: true
        };

        request.post(options, function(error, response, body){
          if (!error && response.statusCode == 200) {
          } else {
            console.log('error: '+ response.statusCode);
          }
        });
    });
  }
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
});
