var express = require('express'),
aws = require('aws-sdk'),
bodyParser = require('body-parser'),
multer = require('multer'),
multerS3 = require('multer-s3');
var router = express.Router();

//model
var User  = require('../models/models').User;
var Event  = require('../models/models').Event;

var s3 = new aws.S3();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'newvuew',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      console.log('key', file);
      cb(null, file.orginalname)
    }
  })
});

// Require login past this point.
router.use('/', function(req, res, next){
  if (!req.user) {
    res.redirect('/');
  } else {
    return next();
  }
});

/* GET event, tinder like view for random event that gear through the user. */
router.get('/getEvents', function(req, res) {
  // console.log(req.query);
  var sort = req.query.sort;
  //Will eventually implement AJAX
  var myId = req.user._id; //This would be req.user in practice
  models.User.findById(myId).exec(function(err, user){
    user.findSeenEvents(function(err, events){
      models.EventCard.find({_id: {"$nin": events}})
      .sort({sort: -1})
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
  });

  //accesss the more information on the event
  //note: this controller will be gone later once we incoorporate jquery
  router.get('/event/:eventId', function(req, res){
    EventCard.findById(req.param._id).exec(function(err, eventCard){
      res.render(LAYOUT, {Images: eventCard.image})
    })
  });

  /* Create event, can only be done by user. */
  router.post('/makeEvent', upload.fields([{name: 'file', maxCount: 4},
  { name: 'video', maxCount: 1}]), function(req, res){
    var eventCard = new models.EventCard({
      title: req.body.title,
      owner: req.user._id,
      price: req.body.price,
      category: req.body.category,
      dateCreated: new Date(),
      eventStartTime: req.body.eventStartTime,
      eventEndTime: req.body.eventEndTime,
      location: req.body.location,
      image: [req.files[file].location],
      video: req.files[video].location,
      usersAttending: []
    })
    eventCard.save(function(err){
      if (err) {
        res.send(err)
      } else {
        res.send('posted Event')
      }
    })

  });

  //when a user like the event, it send a post request and we save the date
  //into the userAction database. Store all of user action for like and dislike
  //also send notification to the owner of the event if the user like it.
  router.post('/likes/:eventid', function(req, res){
    var userAction = new UserAction({
      user: req.user._id,
      eventCard: req.param.eventid,
      likeOrDislike: (req.body.swipe === 'leftSwipe')? false:true //req.body.swipe is defined in AJAX
    });
    models.EventCard.findById(req.param.eventid).exec(function(err, eventCard){
      if (err) {
        res.send(err)
      }
      models.User.findById(event.owner).exec(function(err, user){
        if (err) {
          res.send(err)
        }
        if(userAction.likeOrDislike){
          user.potentialConnection.push(req.user._id)
          user.save(function(err){
            if(err) {
              res.send(err)
            }
          });
        }
        userAction.save(function(err){
          if(err) {
            res.send(err)
             }else {
              res.send('Saved User/UserAction')
            }
          });
        });
      })
    });

  //Owner notification for all usesr that like his event
  //Note: later on we will add a timer for the owner so he need to reply
  //fast, add to the spontenous factor
  router.get('/potentialConnection', function(req, res){
    res.send(req.user.potentialConnections);

  });

  //Owner can decide whether or not he will accept/decline the person
  //match the user, send notification to the user, the owner and the user
  //now can connect using messager as well as access more detail profile
  //of the owner.
  //Depend on the decision of the owner, User.Connection will be populate
  //for the owner and user, thus they are connected.
  //Also start a conversation between the owner and user, template saying,
  //you guy are connected! Let have a adventure together

  //Note: time limit will be add later.
  //Later on: the owner can set auto-accept for trust worthy people with
  //higher rating
  router.post('/potentialConnection/:userId', function(req, res){
    var user1 = req.user;
    var user2Id
    user1.connections.push(user2Id);
    user1.save(function(err){
      if (err){
        res.send(err)
      }
    });
    User.findById(user2Id).exec(function(err, user2){
      user2.connections.push(user1._id);
      user2.save(function(err){
        if(err){
          res.send(err)
        }
      });
    })
    res.send('connection made')
  });


  module.exports = router;
