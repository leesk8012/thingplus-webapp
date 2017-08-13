var cron = require('cron');
var CustomRule = require('../model/tp-custom-rules');
var mongoose = require('mongoose'), db;
var tpRequest = require('./tp-request');
mongoose.Promise = global.Promise;

var tpPersistence = require('./tp-persistence');

var async = require('async');

// 주기적으로 데이터를 읽어와서 체크한다.
exports.monitorJob =  new cron.CronJob('*/10 * * * * *', function() {
    console.log("Job "+Date.now());
    async.series(tasks, function(err, results) {
	//console.log("last");
        //console.log(results[0]);
	//console.log("last");

	// TODO add and compare?
	for (j=0;j<results.length;j++) {
		//console.log(results.length);
		for (k=0;k<results[j].length;k++) {
			console.log(results[0][k]);
			console.log(results[1][k]);
		}
	}
    });
});

var tasks = [ 
		function(callback) {
			var result = [ ];
			tpPersistence.tpFind(CustomRule, {}, function(rules) {
                                async.eachSeries(rules, function(rule, eachSeriesDone) {
                                  tpRequest.sendGetRequest('', "GET",  "http://localhost:8081/gateways/"+rule.gatewayid+"/sensors/"+rule.sensorid+"/series", {}, function (error, response, body) {
                                    if (error || response.statusCode !== 200) { return eachSeriesDone(error || response.statusCode); }

                                    result.push({"lx":body.latest.value , "ly":body.latest.value});
                                    eachSeriesDone();
                                });
                                },
                                function(err) {
                                  if (err) { return callback(err); }

                                  callback(null, result);
                                });
        		});
		},
		function(callback) {
                        var result  = [ ];
                        tpPersistence.tpFind(CustomRule, {}, function(rules) {
                                for (i=0;i < rules.length ;i++) {
                                        result[i] = { "gid":rules[i].gatewayid ,"sid":rules[i].sensorid , "thx" : rules[i].threshold.x, "thy":rules[i].threshold.y };
                                }
                                callback(null, result);
                        });
                }
	];
