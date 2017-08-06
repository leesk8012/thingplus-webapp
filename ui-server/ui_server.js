var express = require('express');
var request = require('request');
var url = require('url');
var app = express();

// config 처리 필요.
//var config = require('./server_info.json');
//var server_url = config.address;
var server_url = 'http://127.0.0.1:8081';

// code 값을 서버로부터 받는 경우
app.get('/', function (req, res) {
  var param = url.parse(req.url, true).query;
  console.log(" / GET");
  //console.log(param);
  // CODE 값을 받았을 경우에만 실행.
  if (Object.keys(param).length > 0) {
    console.log(param);

//  TODO JSON 인자가 서버로 제대로 전달되지 않는다.

    var data = { 'code' : param.code };
    console.log(data);
    var userString = JSON.stringify(data);
    console.log(userString);
    var headers = {
        'Content-Type':     'application/json',
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
            console.log("UI returned "+server_url+"/oauth2/token");
            //console.log(response);
            console.log(body);
            return res.redirect(301, './index.html');
          }
          else {
            console.log(error);
            res.write(response);
            res.end();
          }
        }
    );
    get_token_req.write(userString);
    get_token_req.end();
// TODO 제대로 전달되지 않음.

  }
});

// Auth 값 전달받기위해서 필요? -- Auth 값은 서버에서 가지고 있도록 함.
app.post('/', function (req, res) {
  var params = url.parse(req.url, true).query;
  console.log(" / POST");
  if (Object.keys(params).length > 0) {
    console.log(params);
  }
  // TODO TESTCODE
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('TEST');
  res.end();
  // TODO TESTCODE
});


app.use(express.static('.'));
var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("UI Server app listening at http://%s:%s", host, port);
});
