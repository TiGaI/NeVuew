var express = require('express');
var mongoose = require('mongoose');
var models = require('./models/models');
var bodyParser = require('body-parser');
var path = require('path');

var connect = process.env.MONGODB_URI || require('./models/connect');
// var userConnectionMethods = require('userConnection')

mongoose.connect(connect);

var app = express();
app.set('views', path.join(__dirname, 'views'));

var hbs = require('express-handlebars')({
  defaultLayout: 'layout',
  extname: '.hbs'
});
app.engine('hbs', hbs);
app.set('view engine', 'hbs');



var router = express.Router();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/', router);

router.get('/', function(req, res) {
  res.render('button-test');
});

router.get('/events', function(req,res){
  var EventCard = models.EventCard;
  EventCard.find({},function(err, cards){
    console.log(err);
    console.log(cards);
    res.send(cards[0]);
  })

})
//
// Things to Test:
// Make User
// Make Connection
// Make Potential Connection
// cardSchema
// IsConnected
// Potential Connection gets deleted on make connection and if denied event
router.get('/', function(req, res){
  res.redirect('button-test')
})

router.post('/makeUser', function(req, res){
  console.log(req.body)
  var user = new models.User({
    fname: req.body.fname,
    lname: req.body.lname,
    password: req.body.password,
    email: req.body.email
    // What is admin used for
  });
  user.save(function(err){
    if (err) {
      res.send(err)
    } else {
      res.send('User created')
    }
  })
});

  router.post('/makeEvent', function(req, res){
    var eventCard = new models.EventCard({
      title: req.body.title,
      owner: req.body.userId,
      category: req.body.category,
      dateCreated: new Date(),
      eventStartTime: new Date(),
      eventEndTime: new Date(),
      location: req.body.location,
      usersAttending: []
    })
    eventCard.save(function(err){
      if (err) {
        res.send(err)
      } else {
        res.send('posted Event')
      }
    })
  })

  //put this one on get 'event' after you test and done it
  router.get('/getEvents', function(req, res) {
    // console.log(req.query);

    //Will eventually implement AJAX
    var myId = '58a3478dd88654106477a69e'; //This would be req.user in practice
    models.User.findById(myId).exec(function(err, user){
      user.findSeenEvents(function(err, events){
        models.EventCard.find({_id: {"$nin": events}})
        .sort(sort)
        .limit(10)
        .exec(
          err, function(err, eventsQueue){
            if (err) {
              res.send(err)
            } else {
              console.log(eventsQueue);
              res.send(eventsQueue)
            } //Populate events deck on platform with a render in ajax/handlebars
          });
        })
      })
    })

    //put this one on get 'event/:eventId' after you test and done it
    router.get('/getEvents/:eventId', function(req, res){
      EventCard.findById(req.param._id).exec(function(err, eventCard){
        res.render(LAYOUT, {Images: eventCard.image})
      })
    })


    //put this one on post 'notification' after you test and done it
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

    //this is very similar to get notification, which show all notification for the owner
    //so he knows which person like his event, and he can approve it.
    //read more on my sections
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
