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

var config = require('../config/auth_info.json');
var base_url = config.url.base_url;


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

app.post('/oauth2/token', function (req, res) {
  var params = req.body;
  console.log("Before /oauth2/token :"+req.body.code);
  if (Object.keys(params).length > 0) {
    config.token_param.code = params.code;
    console.log(config.token_param);
    request({
        url: base_url + "/oauth2/token",
        method: "POST",
        json: true,
        body: config.token_param
        },
        function (error, response, body) {
          console.log("After /oauth2/token");
          console.log(body);
          if (body != undefined) {
            var auth = body.token_type + " " + body.access_token;
            fs.writeFile('../config/auth.txt', auth, function(err) {
              if (err) {
                console.log(err);
              }
            });
          }
          res.write("res body = server in oauth2/token");
          res.end();
        }
    );
  }
});

app.get('/gateways', function (req, res) {
  fs.readFile('../config/auth.txt', 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      request({
          url: base_url + "/gateways",
          method: "GET",
          json: true,
          headers: {
              'Content-Type':'application/x-www-form-urlencoded',
              'Authorization': data,
            }
          },
          function (error, response, body) {
            console.log(body);
            res.type('application/json');
            res.jsonp(body.data);
            res.end();
          }
      );
    }
  });
});

app.get('/gateways/*/sensors', function (req, res) {
  fs.readFile('../config/auth.txt', 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      request({
          url: base_url + "/gateways/"+req.params[0]+"/sensors",
          method: "GET",
          json: true,
          headers: {
              'Content-Type':'application/x-www-form-urlencoded',
              'Authorization': data,
            }
          },
          function (error, response, body) {
            console.log(body);
            res.type('application/json');
            res.jsonp(body.data);
            res.end();
          }
      );
    }
  });
});

app.get('/gateways/*/sensors/*/series', function (req, res) {
  fs.readFile('../config/auth.txt', 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      request({
          url: base_url + "/gateways/"+req.params[0]+"/sensors/"+req.params[1]+"/series",
          method: "GET",
          json: true,
          headers: {
              'Content-Type':'application/x-www-form-urlencoded',
              'Authorization': data,
            }
          },
          function (error, response, body) {
            console.log(body);
            res.type('application/json');
            res.jsonp(body.data);
            res.end();
          }
      );
    }
  });
});

app.get('/rules', function (req, res) {
  fs.readFile('../config/auth.txt', 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      request({
          url: base_url + "/rules",
          method: "GET",
          json: true,
          headers: {
              'Content-Type':'application/x-www-form-urlencoded',
              'Authorization': data,
            }
          },
          function (error, response, body) {
            console.log(body);
            res.type('application/json');
            res.jsonp(body.data);
            res.end();
          }
      );
    }
  });
});

app.get('/rules/*', function (req, res) {
  fs.readFile('../config/auth.txt', 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      request({
          url: base_url + "/rules/"+req.params[0],
          method: "GET",
          json: true,
          headers: {
              'Content-Type':'application/x-www-form-urlencoded',
              'Authorization': data,
            }
          },
          function (error, response, body) {
            console.log(body);
            res.type('application/json');
            res.jsonp(body.data);
            res.end();
          }
      );
    }
  });
});

// Delete, Update X

// app.delete('/gateways/', function (req, res) {
//   console.log("delete");
  // console.log(req);
  // console.log(req);
  // var params = req.body;
  // var result = '';
  // console.log(params);
  // if (Object.keys(params).length > 0) {
  //   result = params.data;
  // }
  // res.send(result);
// });

app.use(express.static('.'));
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
   console.log("Server app listening at http://%s:%s", host, port);
});
