var express = require('express');
var request = require('request');
var url = require('url');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// code 수정 더 필요? -- 기능 추가 및 코드 정리 필요.
var config = require('./auth_info.json');
var base_url = "https://nocert.sandbox.thingplus.net/api/v2";

/* API 서버에서는 API 정의가 없는 GET 요청을 받지 않는다.
app.get('/', function (req, res) {
  var params = url.parse(req.url, true).query;
  console.log(" / GET");

  // TODO - GET 을 받지 않는다. UI 에서 GET 을 받으면 POST 로 CODE 를 보내서 ACCESS TOKEN을 받아서 저장하도록 한다.
  // 즉 아래 코드는 UI 의 AngularJS 상의 / GET 을 받는 경우에 호출하도록 해야 한다.
  if (Object.keys(params).length > 0) {
    console.log(params);
    config.token_param.code = params.code;
    console.log(config.token_param);
    request({
        url: base_url + "/oauth2/token",
        method: "POST",
        json: true,
        body: config.token_param
        },
        function (error, response, body) {
          var auth = body.token_type + " " + body.access_token;
          console.log(auth);
          res.write(auth);
          res.end();
          // TODO -- ui server 에 결과 전달
          // 토큰은 서버에서 저장하고 사용한다.
        }
    );
  }
  // TODO
});
*/
/* 마찬가지로 POST 요청을 받지 않는다.
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
*/


var headers = {
    'Content-Type':'application/x-www-form-urlencoded'
};

// 요청 세부 내용
var options = {
    url: 'http://samwize.com',
    method:'POST',
    headers: headers,
    form: {'key1': 'xxx', 'key2': 'yyy'}
};

// CODE 를 얻는 API 임. 네이밍 변경이 필요할지도 모름. - 적절한 이름이 없으면 API 매뉴얼을 보고 그대로 적도록 한다.
app.get('/auth', function (req, res) {
  // auth 코드 확인??

  var response_type = config.user_info.response_type;
  var client_id = config.user_info.client_id;
  var redirect_uri = config.user_info.redirect_uri;
  return res.redirect(301, base_url + "/oauth2/authorize?response_type="+response_type+"&client_id="+client_id+"&redirect_uri="+redirect_uri);
});

// Access token 을 얻는 API. Access token 을 저장? -- 인자를 못받음
app.post('/oauth2/token', function (req, res) {
  var params = req.body;
  if (Object.keys(params).length > 0) {
    console.log(params);
    config.token_param.code = params.code;

    // TODO
    request({
        url: base_url + "/oauth2/token",
        method: "POST",
        json: true,
        body: config.token_param
        },
        function (error, response, body) {
          var auth = body.token_type + " " + body.access_token;
          fs.writeFile('auth.txt', auth, function(err) {
            if (err) {
              console.log(err);
            }
          });
          // API 정의 및 status code 반환
          res.write('');
          res.end();
        }
    );
    // TODO
  }
  else {
    console.log("No param POST /oauth2/token");
    res.write('NO PARAM');
    res.end();
  }
});

var auth_code;

app.use(express.static('.'));
var server = app.listen(8081, function () {
    fs.readFile('auth.txt', 'utf8', function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
        auth_code = data;
        console.log(auth_code);
      }
    });
    var host = server.address().address;
    var port = server.address().port;
   console.log("Server app listening at http://%s:%s", host, port);
});
