var CustomRule = require('../model/tp-custom-rules');
var tpPersistence = require('./tp-persistence');

exports.add = function(data, callback) {
  var newCustomRule = CustomRule(data);
  tpPersistence.tpSave(newCustomRule, function(error, result) {
    callback(error, result);
  });
};

exports.update = function(find, data, callback) {
  tpPersistence.tpUpdate(CustomRule, find, data, function(error) {
    callback(error);
  });
};

exports.get = function(param, callback){
  tpPersistence.tpFind(CustomRule, param, function(error, result) {
    callback(error, result);
  });
};

exports.remove = function(param, callback) {
  tpPersistence.tpDelete(CustomRule, param, function(error) {
    callback(error);
  });
};
