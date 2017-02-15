var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var connect = process.env.MONGODB_URI || require('./connect');
var express = require('express')
// var userConnection = require('../userConnection')

// mongoose.connect(connect);

var userActionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  eventCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventCard'
  },
  likeOrDislike: Boolean; // true refers to like, false refers to dislike.
})

var userSchema = new mongoose.Schema({
  //How can we keep track of User Activity?
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  //Need to Hash Password
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ""
  },
  created: Date,
  email: {
    type: String,
    required: true
  }
  image: String,
  videos: [String],
  activeEvents: [mongoose.Schema.Types.ObjectId],
  connections: [mongoose.Schema.Types.ObjectId],
  admin: {
  	type: Boolean,
  	default: false
  },
  rating: {
    type: Number
  }
});

var userConnectionSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

var eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: String,
  dateCreated: String,
  eventStartTime: Date,
  eventEndTime: Date
  location: String,
  image: Array,
  video: String,
  usersAttending: [mongoose.Schema.Types.ObjectId]
  // category: String
});

var messageSchema = new mongoose.Schema({
	body: {
      type: String,
      required: true
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    dateCreated :{
      type: Date,
      required: true
    }
});

//Add Schema Methods

userSchema.methods.isConnected = function(idToCheck, callback){
  var connection = this.connections.includes(idTOCheck)
  callback(null, connection)
};

userSchema.methods.getConnectionsSorted = function(callback){
  var allconnections = this,connections.reverse();
      callback(err, allConnections);
    });
  });
};

// userSchema.statics.findByNumActiveCards
// userSchema.virtual.getActivity =


var Message = mongoose.model("Message", messageSchema);
var User = mongoose.model("User", userSchema);
// var UserConnection = mongoose.model("UserConnection", userConnectionSchema);
// var PotentialConnection = mongoose.model("PotentialConnection", potentialConnectionSchema);
var UserAction = mongoose.model("UserAction", userActionSchema);
var EventCard = mongoose.model("EventCard", eventSchema)

module.exports = {
    Message: Message,
    User: User,
    UserConnection: UserConnection,
    UserAction: UserAction,
    EventCard: EventCard

};
