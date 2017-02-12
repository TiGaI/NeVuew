var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);


var example = mongoose.Schema({
  created: Date,
  content: String,
  user: String,
  contact: String,
  channel: String
});

module.exports = {
    example: mongoose.model('example', example),
};
