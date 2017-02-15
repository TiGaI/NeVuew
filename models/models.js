var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var connect = process.env.MONGODB_URI || require('./connect');
var express = require('express')
// var userConnection = require('../userConnection')

// mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  //How can we keep track of User Activity?
  name: String,
  created: Date,
  email: String,
  image: String,
  activeCards: [mongoose.Schema.Types.ObjectId],
  connections: [mongoose.Schema.Types.ObjectId],
  profile: mongoose.Schema.Types.ObjectId,
  admin: {
  	type: Boolean,
  	default: true
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

var potentialConnectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  potentialMatch: {
    type: mongoose.Schema.Types.ObjectId,
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

//Add Schema Methods
userSchema.methods.makeConnection = function(idToConnect, callback){
  var myId = this._id;
  PotentialConnection.findOne({user: idToConnect, potentialMatch: myId})
  .exec(function(err, potConnect){
    if (err){
      callback(err)
    }
    if (potConnect){
      var userConnection = new UserConnection({
        user1: myId,
        user2: idToConnect
      });
      potConnect.remove();
      userConnection.save(function(err, userConnection){
        if (err){
          callback(err);
        }
        callback(null, userConnection) // Do Something with User Connection
      })
    } else {
      var potentialConnection = new PotentialConnection({
        user: myId,
        potentialMatch: idToConnect
      });
      potentialConnection.save(err);
      if(err) res.send(err)
      callback(err, potentialConnection) //Do something with potentialConnection
      // A lot of things can happen here. We can either make a potentialConnection
      // Or we can keep track that of who liked whom/didnt't like whom
    }
  });
};

userSchema.methods.isConnected = function(idToCheck, callback){
  var myId = this._id;
  console.log(myId)
  UserConnection.findOne({user1: myId, user2: idToCheck}, function(err, connection){
    if (err) res.send(err)
    console.log('first find ', connection)
    if (connection) {
      callback(null, true);
    } else {
      UserConnection.findOne({user1: idToCheck, user2: myId}, function(err, connection){
        if (err) res.send(err)
        console.log('second find ', connection)
        if (connection) {
          callback(null, true);
        } else{
          callback(null, false);
        }
      });
    }
  });
};

userSchema.methods.getConnections = function(callback){
  var allConnections = [];
  UserConnection.find({user1: this_id}, function(err, connections1){
    if (err) res.send(err)
    allConnections.push(connections1);
    UserConnection.find({user2: this_id}, function(err, connections2){
      if(err) res.send(err)
      allConnections.push(connections2);
      //
      //Implement Sort Function
      //
      callback(err, allConnections);
    });
  });
};

// userSchema.statics.findByNumActiveCards
// userSchema.virtual.getActivity =

// userSchema.statics.findOrCreate = function findOrCreate(profile, cb){
//     var user = new this();
//     this.findOne({facebookId : profile.id},function(err, result){
//         if(! result) {
//             user.username = profile.displayName;
//             user.facebookId = profile.id;
//             user.save(cb);
//         } else {
//             cb(err,result);
//         }
//     });
// };

var Message = mongoose.model("Message", messageSchema);
var User = mongoose.model("User", userSchema);
var UserConnection = mongoose.model("UserConnection", userConnectionSchema);
var PotentialConnection = mongoose.model("PotentialConnection", potentialConnectionSchema);

module.exports = {
    // Card: mongoose.model('Card', Card),
    Message: Message,
    User: User,
    UserConnection: UserConnection,
    PotentialConnection: PotentialConnection
};
