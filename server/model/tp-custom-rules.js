var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomRuleSchema = new Schema({
  id: String,
  desc: String,
  name: String,
  gatewayid: String,
  sensorid : String,
  threshold: Array,
  method: String,
  status: String
});

module.exports = mongoose.model('CustomRule', CustomRuleSchema, "CustomRule");
