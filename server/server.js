var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var tpRequest = require('./lib/tp-request');
var tpMonitor = require('./lib/tp-monitor');

// TODO
var tpLogRequest = require('./lib/tp-logrequest');

tpMonitor.monitorJob.start();

var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var config = require('../config/auth_info.json');
var base_url = config.url.base_url;

var errorPage = function(res, errorMsg, statusCode) {
  res.type('application/json');
  res.status(statusCode);
  res.write(errorMsg);
  res.end();
};


app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
});


app.get('/auth', function (req, res) {
  var response_type = config.user_info.response_type;
  var client_id = config.user_info.client_id;
  var redirect_uri = config.user_info.redirect_uri;
  return res.redirect(301, base_url + "/oauth2/authorize?response_type="+response_type+"&client_id="+client_id+"&redirect_uri="+redirect_uri);
});

// OAuth2 token 얻기
app.post('/oauth2/token', function (req, res) {
  if (Object.keys(req.body).length > 0) {
    config.token_param.code = req.body.code;
    console.log(config.token_param);
    tpRequest.sendGetRequest('', "POST", base_url + "/oauth2/token", config.token_param, function (error, response, body) {
      tpRequest.setAuth(body.token_type + " " + body.access_token, function() {
        res.type('application/json');
        res.status(response.statusCode);
        res.write("server oauth2/token finished.");
        res.end();
      });
    });
  }
});

//  GET 게이트웨이 리스트
app.get('/gateways', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "GET", base_url + "/gateways", {}, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.jsonp(body.data);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});


//  GET 게이트웨이 정보
app.get('/gateways/*', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "GET", base_url + "/gateways/"+req.params[0], {}, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.jsonp(body.data);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});


// 게이트웨이 정보 업데이트
app.put('/gateways/*', function (req, res) {
    tpRequest.getAuth(function (fsErr, auth) {
      if (!fsErr) {
        tpRequest.sendGetRequest(auth, "PUT", base_url + "/gateways/"+req.params[0], req.body, function (error, response, body) {
          res.type('application/json');
          res.status(response.statusCode);
          res.jsonp(body.data);
          res.end();
        });
      }
      else {
        res.type('application/json');
        res.status(500);
        res.write(fsErr);
        res.end();
      }
    });
});

// 게이트웨이 정보 삭제
app.delete('/gateways/*', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "DELETE", base_url + "/gateways/"+req.params[0], {}, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});

// 게이트웨이 등록 (센서도 같이 등록하기)
app.post('/registerGateway', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "POST", base_url + "/registerGateway", req.body, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.jsonp(body.data);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});


// 특정 게이트웨이의 센서 리스트
app.get('/gateways/*/sensors', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "GET", base_url + "/gateways/"+req.params[0]+"/sensors", {}, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.jsonp(body.data);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});

// Sensor 값 측정
app.get('/gateways/*/sensors/*/series', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "GET", base_url + "/gateways/"+req.params[0]+"/sensors/"+req.params[1]+"/series", {}, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.jsonp(body.data);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});

// 규칙 리스트 -- Custom Rules 에 대해서도 리스트를 해줌?
app.get('/rules', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "GET", base_url + "/rules", {}, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.jsonp(body.data);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});

// 규칙 정보 -- Custom Rules 에 대해서도 정보를 얻어줌?
app.get('/rules/*', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "GET", base_url + "/rules/"+req.params[0], {}, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.jsonp(body.data);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});

// 규칙 추가
app.post('/rules', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "POST", base_url + "/rules", req.body, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.jsonp(body.data);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});

// 규칙 업데이트
app.put('/rules/*', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "PUT", base_url + "/rules/"+req.params[0], req.body, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.jsonp(body.data);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});

// 규칙 삭제
app.delete('/rules/*', function (req, res) {
  tpRequest.getAuth(function (fsErr, auth) {
    if (!fsErr) {
      tpRequest.sendGetRequest(auth, "DELETE", base_url + "/rules/"+req.params[0], {}, function (error, response, body) {
        res.type('application/json');
        res.status(response.statusCode);
        res.end();
      });
    }
    else {
      res.type('application/json');
      res.status(500);
      res.write(fsErr);
      res.end();
    }
  });
});

// TODO EXAMPLE
// {
//   id: "test3",
//   desc: "dsec",
//   name: "nnn",
//   threshold:[{fromX:3, fromY:30}, {fromY:4, toY:20}],
//   status: "warn",
//   method: "outOfRange",
//   gatewayid: "e9e3c42429d64e4897861b968265471e",
//   sensorid: "location-e9e3c42429d64e4897861b968265471e-1"
// }
// logrules add --
app.post('/logrules/*', function (req, res) {

});


// logrules delete
app.delete('/logrules/*', function (req, res) {

});


// logrules update
app.put('/logrules/*', function (req, res) {
  tpLogRequest.add(function() {
    res.type('application/json');
    res.write('');
    res.status(200);
    res.end();
  });
});

// logrules get

app.use(express.static('.'));
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
   console.log("Server app listening at http://%s:%s", host, port);
});
