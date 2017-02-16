var express = require('express');
var mongoose = require('mongoose');
var models = require('./models/models');
var bodyParser = require('body-parser')

var connect = process.env.MONGODB_URI || require('./models/connect');
// var userConnectionMethods = require('userConnection')

mongoose.connect(connect);

var app = express();

var router = express.Router();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/', router);

router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});
//
// Things to Test:
// Make User
// Make Connection
// Make Potential Connection
// cardSchema
// IsConnected
// Potential Connection gets deleted on make connection and if denied event

router.post('/makeUser', function(req, res){
  console.log(req.body)
  var user = new models.User({
    name: req.body.name,
    created: new Date(),
    email: req.body.email,
    image: req.body.imageStr,
    activeCards: []
    // What is admin used for
  });
  user.save(function(err){
    if (err) res.send(err)
  })
  res.send('User created')
})

router.post('/makeEvent', function(req, res){
  var evenCard = new models.EventCard({
    title: req.body.title,
    owner: req.body.userId,
    category: req.body.category,
    dateCreated: new Date(),
    eventStartTime: new Date(),
    eventEndTime: new Date(),
    location: req.body.location,
    usersAttending: []
  })
})

router.post('/makeConnection', function(req, res){
  //req.user?
  var myId = req.body.myId;
  var theirId = req.body.theirId;

  models.User.findById(myId).exec(function(err, user){
    console.log(user)
    user.makeConnection(theirId, function(err, connection){
      res.send('connection made!');
    })
  })
})

router.post('/isConnected', function(req, res){
  var myId = req.body.myId;
  var theirId = req.body.theirId;
  models.User.findById(myId).exec(function(err, user){
    user.isConnected(theirId, function(err, trueOrFalse){
      if (err) res.send(err)
      res.send(trueOrFalse);
    })
  })
})
app.listen(process.env.PORT || 3000);
