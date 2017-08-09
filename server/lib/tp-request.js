var request = require('request');
var fs = require('fs');

exports.getAuth = function(callback) {
  fs.readFile('../config/auth.txt', 'utf-8', function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      return callback(data);
    }
  });
}

exports.setAuth = function(auth, callback) {
  fs.writeFile('../config/auth.txt', auth, function(err) {
    if (err) {
      console.log(err);
    }
    return callback();
  });
}

exports.sendGetRequest = function(auth, method, url, body, callback) {
  var options = {
    url: url,
    method: method,
    json: true,
    headers: {
      'Content-Type':'application/json',
      'Authorization': auth,
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
}
