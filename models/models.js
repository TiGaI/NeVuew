var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');


var connect = process.env.MONGODB_URI || require('./connect');
var express = require('express')

mongoose.connect(connect);

var User = mongoose.Schema({
  name: String,
  created: Date,
  email: String,
  image: String,
  admin: {
  	type: Boolean,
  	default: true
  }
});

var Card = mongoose.Schema({
  title: String,
  coordinator: String,
  de: String,
  CardTime: Date,
  CardAddress: String,
  created: Date,
  image: String,
  // video: Content,
  // category: String
});

var Message = mongoose.Schema({
	body: {
      type: String,
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    }
});

User.statics.findOrCreate = function findOrCreate(profile, cb){
    var user = new this();
    this.findOne({facebookId : profile.id},function(err, result){
        if(! result) {
            user.username = profile.displayName;
            user.facebookId = profile.id;
            user.save(cb);
        } else {
            cb(err,result);
        }
    });
};

module.exports = {
    Card: mongoose.model('Card', Card),
    Message: mongoose.model("Message", Message),
    User: mongoose.model("User", User)
};