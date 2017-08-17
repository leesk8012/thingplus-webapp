var cron = require('cron');
var CustomRule = require('../model/tp-custom-rules');
var tpRequest = require('./tp-request');
var tpPersistence = require('./tp-persistence');
var async = require('async');

tpPersistence.tpConnect();

// 주기적으로 데이터를 읽어와서 체크한다.
exports.monitorJob =  new cron.CronJob('*/10 * * * * *', function() {
    // console.log("Job "+Date.now());
    async.series(tasks, function(err, results) {
      // TODO add and compare?
      for (j=0;j<results.length;j++) {
        for (k=0;k<results[j].length;k++) {
          // from API
          //console.log(results[0][k]);
          // from DB
          //console.log(results[1][k]);
          switch(results[1][k].method) {
            case "outOfRange":
              if (results[1][k].threshold[0].fromlat > results[0][k].lat || results[1][k].threshold[0].tolat < results[0][k].lat ||
                results[1][k].threshold[0].fromlng > results[0][k].lng || results[1][k].threshold[0].tolng < results[0][k].lng) {
                // Find and Save
                tpPersistence.tpUpdate(CustomRule, {"sensorid": results[1][k].sensorid}, { "status":"warn" }, function() {});
                console.log("["+Date.now()+"] warn sensorid :"+ results[1][k].sensorid);
              }
              else {
                tpPersistence.tpUpdate(CustomRule, {"sensorid": results[1][k].sensorid}, { "status":"ok" }, function() {});
              }
              break;
          }
        }
      }
  });
});

var tasks = [
  function(callback) {
    var result = [ ];
    tpPersistence.tpFind(CustomRule, {}, function(error, rules) {
      async.eachSeries(rules, function(rule, eachSeriesDone) {
        tpRequest.sendGetRequest('', "GET",  "http://localhost:8081/gateways/"+rule.gatewayid+"/sensors/"+rule.sensorid+"/series", {}, function (error, response, body) {
          if (error || response.statusCode !== 200) { return eachSeriesDone(error || response.statusCode); }

          // TODO 일반 타입인 경우에는
          // result.push({"lx":body.latest.value , "ly":body.latest.value});  // 테스트에서 하나의 값만 나오는 센서의 경우, 다른 센서에 같은 값을 추가하였다.
          // TODO 위치 타입인 경우에는 값이 다르다.
          result.push({"lat":body.latest.value.lat , "lng":body.latest.value.lng});  // 테스트에서 하나의 값만 나오는 센서의 경우, 다른 센서에 같은 값을 추가하였다.
          eachSeriesDone();
        });
      },
      function(err) {
        if (err) { return callback(err, []); }

        callback(null, result);
      });
    });
  },
  function(callback) {
    var result  = [ ];
    tpPersistence.tpFind(CustomRule, {}, function(error, rules) {
      for (i=0;i < rules.length ;i++) {
        result[i] = { "gatewayid":rules[i].gatewayid ,"sensorid":rules[i].sensorid , "threshold" : rules[i].threshold, "method" : rules[i].method };
      }
      callback(null, result);
    });
  }
];
