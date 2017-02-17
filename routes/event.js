var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');
var router = express.Router();

//model
var User  = require('../models/models').User;
var EventCard  = require('../models/models').EventCard;

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
    Key: function (req, file, cb) {
      // console.log('key', file);
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
router.get('/eventSwipe', function(req, res){
  res.render('eventSwipe');

});

//accesss the more information on the event
//note: this controller will be gone later once we incoorporate jquery
router.get('/event/:eventId', function(req, res){


});

//Get the form 
router.get('/makeEvent', function(req, res){
  res.render('eventCreate', {user: req.user});
});

/* Create event, can only be done by user. */
router.post('/makeEvent', upload.fields([{name: 'file', maxCount: 4},
	{ name: 'video', maxCount: 1}]), function(req, res){
    // console.log(req.files);
    //  console.log("files " + req.files['file'][0]['location']);
    // console.log("video " + req.files['video'][0]['location']);

  var eventCard = new EventCard({
    title: req.body.title,
    owner: req.user._id,
    price: req.body.price,
    category: req.body.category,
    dateCreated: new Date(),
    eventStartTime: req.body.eventStartTime,
    eventEndTime: req.body.eventEndTime,
    location: req.body.location,
    image: req.files['file'][0]['location'],
    video: req.files['video'][0]['location'],
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


});

//Owner notification for all usesr that like his event
//Note: later on we will add a timer for the owner so he need to reply
//fast, add to the spontenous factor
router.get('/notifications/:eventId', function(req, res){
  EventCard.findById(eventId, function(err, event){

    if (err) {
      res.send(err)
    } else {
        if(req.user._id === event.owner){
          res.render('notifications', {user: req.user,
                                       event: event,
                                       potentialuser: event.potentialAttendee
                                      });
        }else{
          res.send('You have no access to this page')
        }
    }

  

  })
  
  
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
router.post('/notifications', function(req, res){


});


module.exports = router;