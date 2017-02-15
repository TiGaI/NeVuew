var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var connect = process.env.MONGODB_URI || require('./connect');
var express = require('express')

mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  //How can we keep track of User Activity?
  name: String,
  created: Date,
  email: String,
  image: String,
  activeCards: [mongoose.Schema.Types.ObjectId],
  profile: mongoose.Schema.Types.ObjectId,
  admin: {
  	type: Boolean,
  	default: true
  }
});

var userConnectionSchema = new mongoose.Schema({
  user1 = {
    type: mongoose.Schema.Types.ObjectId
    ref: 'User'
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

var potentialConnectionSchema = new mongoose.Schema({
  user = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  potentialMatch = {
    type: monogoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
var cardSchema = new mongoose.Schema({
  title: String,
  coordinator: String,
  de: String,
  CardTime: Date,
  CardAddress: String,
  created: Date,
  image: Array,
  // category: String
});

var messageSchema = new mongoose.Schema({
	body: {
      type: String,
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
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
    // Card: mongoose.model('Card', Card),
    Message: mongoose.model("Message", messageSchema),
    User: mongoose.model("User", userSchema),
    UserConnection: mongoose.model("UserConnection", userConnectionSchema),
    PotentialConnection: monogose.model("PotentialConnection", potentialConnectionSchema)
};
