var mongoose = require('mongoose');

var userActionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  eventCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventCard'
  },
  likeOrDislike: Boolean // true refers to like, false refers to dislike.
}, {timestamps: true})

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
    type: String
  },
  bio: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    required: true
  },
  image: [String],
  videos: [String],
  activeEvents: [{type: mongoose.Schema.Types.ObjectId, ref: 'EventCard'}],
  connections: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  admin: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number
}, {timestamps: true});

var eventSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  description: {
    type: String,
    required: true
  },
  category: String,
  eventStartTime: String,
  eventEndTime: String,
  price: {
    type: Number,
    required: String
  },
  location: String,
  image: {
    picture1: String,
    picture2: String,
    picture3: String
  },
  video: String,
  usersAttending: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  // category: String
  likes: [],
  dislike:[],
  pendingConnections: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {timestamps: true});

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
  var allconnections = this.connections.reverse();
  callback(err, allConnections);
};

userSchema.methods.findSeenEvents = function(callback){
  UserAction.find({user: this._id}, function(err, actions){
    if (err) res.send(err)
    var seenEvents = actions.map(function(action){
      return action.eventCard;
    })
    callback(null, seenEvents)
  })
}

// userSchema.statics.findByNumActiveCards
// userSchema.virtual.getActivity =


var Message = mongoose.model("Message", messageSchema);
var User = mongoose.model("User", userSchema);
var UserAction = mongoose.model("UserAction", userActionSchema);
var EventCard = mongoose.model("EventCard", eventSchema)

module.exports = {
  Message: Message,
  User: User,
  UserAction: UserAction,
  EventCard: EventCard
};
