var express = require('express');
var request = require('request');
var url = require('url');
var app = express();

var config = require('../config/auth_info.json');

var server_url = config.url.server_url;
var base_url = config.url.base_url;
var redirect_uri = config.user_info.redirect_uri;

app.get('/', function (req, res) {
  var param = url.parse(req.url, true).query;
  if (Object.keys(param).length > 0) {
    console.log(param);
    var data = { 'code' : param.code };
    var userString = JSON.stringify(data);
    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': userString.length
    };
    var options = {
        url: server_url + "/oauth2/token",
        method:'POST',
        headers: headers
    };
    var get_token_req = request(options,
        function (error, response, body) {
          if (!error) {
            console.log('go : '+redirect_uri+'/index.html');
            return res.redirect(301, redirect_uri+'/index.html');
          }
          else {
            console.log(error);
            res.end();
          }
        }
    );
    console.log("what is it?");
    get_token_req.write(userString);
    get_token_req.end();
  }
  else {
    var response_type = config.user_info.response_type;
    var client_id = config.user_info.client_id;
    // var redirect_uri = config.user_info.redirect_uri;
    return res.redirect(301, base_url + "/oauth2/authorize?response_type="+response_type+"&client_id="+client_id+"&redirect_uri="+redirect_uri);
  }
});

app.use(express.static('ui-server'));
app.use(express.static('ui-server/html'));
var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("UI Server app listening at http://%s:%s", host, port);
});
