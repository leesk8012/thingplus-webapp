var express = require('express');
var request = require('request');
var url = require('url');
var app = express();

// config 처리
// GET 처리
var user_info = { "client_id":"sungkeun2", "response_type":"code", "redirect_uri":"http://127.0.0.1:8080" }
//
var token_param = {"client_id": "sungkeun2","client_secret": "akapeng2","redirect_uri": "http://127.0.0.1:8080","grant_type": "authorization_code"}
// config 처리

var base_url = "https://nocert.sandbox.thingplus.net/api/v2"

app.get('/', function (req, res) {
  var params = url.parse(req.url, true).query
  if (Object.keys(params).length > 0) {
    console.log(params)
    token_param['code'] = params.code
    console.log(token_param)
    request({
        url: base_url + "/oauth2/token",
        method: "POST",
        json: true,
        body: token_param
        },
        function (error, response, body) {
          var auth = body.token_type + " " + body.access_token

          // TODO -- 코드 값을 UI 전달, 초기 페이지에서 사용하여야 됨.
          request({
              url: base_url + "/",
              method: "POST",
              json: true,
              body: { 'auth':auth }
              }
          );
          // TODO
        }
    );
  }
})

app.post('/', function (req, res) {
  var params = url.parse(req.url, true).query
  if (Object.keys(params).length > 0) {
    console.log(params)
  }
  // TODO TESTCODE
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('TEST')
  res.end()
  // TODO TESTCODE
})

app.get('/auth', function (req, res) {
  return res.redirect(301, base_url + "/oauth2/authorize?response_type="+user_info.response_type+"&client_id="+user_info.client_id+"&redirect_uri="+user_info.redirect_uri);
})

app.use(express.static('.'));
var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
