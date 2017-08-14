var CustomRule = require('../model/tp-custom-rules');
var tpPersistence = require('./tp-persistence');

exports.add = function(callback) {
  var newCustomRule = CustomRule({
    id: "test3",
    desc: "dsec",
    name: "nnn",
    threshold:[{fromX:3, fromY:30}, {fromY:4, toY:20}],
    status: "warn",
    method: "outOfRange",
    gatewayid: "e9e3c42429d64e4897861b968265471e",
    sensorid: "location-e9e3c42429d64e4897861b968265471e-1"
  });

  // Save 를 하는 경우.
  // newCustomRule.save(function(err){
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log("writes custom rule");
  //   return callback();
  // });

  // tpPersistence.tpUpdate(newCustomRule, function(){});

};
