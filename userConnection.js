var models = require('./models/models');
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var connect = process.env.MONGODB_URI || require('./models/connect');

// UserSchema.methods.makePotentialConnection = function(idToConnect, callback){
//   PotnetialConnection.findOne({user: idToConnect, potentialMatch: this._id})
//   .exec(function(err, potnetialConnection){
//     if (err){
//       callback(err)
//     }
//     if (potnetialConnection){
//       var userConection = new models.UserConnection({
//         user1: this._id,
//         user2: idToFollow
//       });
// };

models.userSchema.methods.makeConnection = function(idToConnect, callback){
  PotnetialConnection.findOne({user: idToConnect, potentialMatch: this._id})
  .exec(function(err, potConnect){
    if (err){
      callback(err)
    }
    if (potConnect){
      var userConection = new models.UserConnection({
        user1: this._id,
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
        user: this._id,
        potentialMatch: idToConnect
      });
      potentialConnection.save(err);
      if(err) res.send(err)
      calback(err, potentialConnection) //Do something with potentialConnection
      // A lot of things can happen here. We can either make a potentialConnection
      // Or we can keep track that of who liked whom/didnt't like whom
    }
  });
};

models.userSchema.methods.isConnected = function(idToCheck, callback){
  UserConnection.findOne({user1: this._id, user: idToCheck}, function(err, connection){
    if (err) res.send(err)
    if (connection) {
      callback(null, true);
    } else {
      UserConnection.findOne({user1: idToCheck, user: this._id}, function(err, connection){
        if (err) res.send(err)
        if (connection) {
          callback(null, true);
        } else{
          callback(null, false);
        }
      });
    }
  });
};

models.userSchema.methods.getConnections = function(callback){
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
