var request = require('request');
var fs = require('fs');

var authPath = process.cwd()+ '/config/auth.txt';

exports.getAuth = function(callback) {
  fs.readFile(authPath, 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      return callback(data);
    }
  });
};

exports.setAuth = function(auth, callback) {
  fs.writeFile(authPath, auth, function(err) {
    if (err) {
      console.log(err);
    }
    return callback();
  });
};

exports.sendGetRequest = function(auth, method, url, body, callback) {
  var options = {
    url: url,
    method: method,
    json: true,
    headers: {
      "Content-Type": "application/json",
      "Authorization": auth
    }
  };

  switch (method) {
    case "GET":
    case "DELETE":
      request(options, function (error, response, body) {
          if (error) {
            console.log(error);
          }
          return callback(error, response, body);
      });
      break;
    case "POST":
    case "PUT":
      options.body = body;
      request(options, function (error, response, body) {
          if (error) {
            console.log(error);
          }
          return callback(error, response, body);
      });
      break;
  }
};
