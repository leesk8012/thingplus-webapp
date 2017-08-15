var CustomRule = require('../model/tp-custom-rules');
var mongoose = require('mongoose'), db;
mongoose.Promise = global.Promise;

var config = require('../../config/auth_info.json');
var mongoDB = 'mongodb://'+config.url.mongodb+'/tpwebapp';

exports.tpConnect = function() {
  mongoose.connect(mongoDB);

  mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + mongoDB);
  });

  // If the connection throws an error
  mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
};

// TODO 연결시 주의
exports.tpFind = function(collection, query, callback) {
  collection.find(query, function(error, result) {
    if (error) {
      console.log(error);
    }
    return callback(error, result);
  });
};

exports.tpSave = function(collection, callback) {
  collection.save(function(error, result) {
    if (error) {
      console.log(error);
    }
    return callback(error, result);
  });
};

exports.tpUpdate = function(collection, find, data, callback) {
  collection.findOneAndUpdate(find, data, function(error) {
    if (error) {
      console.log(error);
    }
    return callback(error);
  });
};

exports.tpDelete = function( collection, find, callback ) {
  collection.findOneAndRemove(find, function(error) {
    if (error) {
      console.log(error);
    }
    return callback(error);
  });
};
