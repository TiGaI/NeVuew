var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');
var router = express.Router();

var User  = require('../models/models').User;
var Event  = require('../models/models').Event;
var Message  = require('../models/models').Message;

/* GET message page. */
router.get('/connections', function(req, res){




});

router.get('/message/:userid', function(req, res){




});

router.post('/message/:userid', function(req, res){
	  if (! req.body.body) {
	    res.status(400).render('messenger', {
	      user: req.user,
	      error: "Post body is required."
	    });
	  } else if (! req.body.to) {
	    res.status(400).render('messenger', {
	      user: req.user,
	      error: "To field is required."
	    });
	  } else {
	   User.findOne({
	      username: req.body.to
	    }, function(err, toUser) {
	      if (err) {
	        res.status(400).render('stagemessenger', {
	          user: req.user,
	          error: err.errmsg
	        });
	      } else if (! toUser) {
	        res.status(400).render('messenger', {
	          user: req.user,
	          error: "No such user: " + req.body.to
	        });
	      } else {
	        var message = new models.Message({
	          from: req.user._id,
	          to: toUser._id,
	          body: req.body.body
	        });
	        message.save(function(err) {
	          if (err) {
	            res.status(500).render('messenger', {
	              user: req.user,
	              error: err.errmsg,
	            })
	          } else {
	            res.redirect('messenger?success=Sent!');
	          }
	        });
	      }
	    });
	  }
});

router.post('/delete/:userId', function(req, res) {
  if (! req.params.messageId) {
    res.status(400).render('messenger', {
      user: req.user,
      error: 'Message id missing'
    });
  } else {
    Message.findByIdAndRemove(req.params.messageId, function(err) {
      if (err) {
        res.status(400).render('messenger', {
          user: req.user,
          error: err.errmsg
        });
      } else {
        res.redirect('/exercise2/messenger?success=Deleted!');
      }
    });
  }
});

module.exports = router;