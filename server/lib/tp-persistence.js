var CustomRule = require('../model/tp-custom-rules');
var mongoose = require('mongoose'), db;
mongoose.Promise = global.Promise;

var config = require('../../config/auth_info.json');
var mongoDB = 'mongodb://'+config.url.mongodb+'/tpwebapp';

exports.tpFind = function(collection, query, callback) {
  mongoose.connect(mongoDB, function(error) {
  if (error) {
    throw error;
  }
  collection.find(query, function(error, result) {
    if (error) {
      throw error;
    }
    mongoose.connection.close();
    return callback(result);
  });
  });
};

exports.tpSave = function(collection, callback) {
  mongoose.connect(mongoDB, function(error) {
  if (error) {
    throw error;
  }
  collection.save(function(error) {
    if (error) {
      throw error;
    }
    console.log("save() success");
    mongoose.connection.close();
    return callback(result);
  });
  });
};

exports.tpDelete = function(collection, callback ) {
  mongoose.connect(mongoDB, function(error) {
  if (error) {
    throw error;
  }
  collection.remove(function(error) {
    if (error) {
      throw error;
    }
    console.log("save() success");
    mongoose.connection.close();
    return callback(result);
  });
  });
};
