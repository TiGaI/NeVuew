var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');
var router = express.Router();

var User  = require('../models/models').User;
var Event  = require('../models/models').Event;
var Message  = require('../models/models').Message;

/* GET message page. search all the users connections and display*/
router.get('/connections/:userId', function(req, res){

	User.findById(req.params.userId, function(err, user){

		if(err){
			res.send('invalid userId')
			res.redirect('/')
		}else{

			res.render('/message', {
				connection: user.connections.user2,
				currentuser: user
				})
		}
	});


});

// Get conversation between currentuser and that special connection user
router.get('/message/:userid', function(req, res){
	Message.find({ $or: [{user1: req.params.userid, user2: req.user._id}, 
						 {user2: req.params.userid, user1: req.user._id}]})
			.sort('dateCreated').exec(function(err, message){
				if(err){
					res.send('invalid Message, conversation does not exist')
					res.redirect('/connections/req.user._id')
				}else{
					res.render('message', {
						conversation: message
					})
				}
			});
});

// $('#button').on('click', function(){
// $.ajax({
// 	url: "/message/" + req.quer,
// 	success: function(data){
// 	}
// })
// })
// Post a new body to the conversation between currentuser and that special connection user
router.post('/message/:userid', function(req, res){
	  if (! req.body.body) {
	    res.status(400).render('messenger', {
	      user: req.user.content,
	      error: "Post body is required."
	    });
	  }else {
	  	var newMessage = {
	  		user1: req.user._id,
	  		user2: req.params.userId,
	  		body: req.body.message,
	  		dateCreated: new Date()
	  	}
	  	newMessage.save(function(err){
	  		if(err){
	  			res.send('invalid Message, conversation does not exist')
				res.redirect('/connections/req.user._id')
	  		}
	  		res.redirect('/message/' + req.params.userid);		
	  	})
	  }
	
});

// User can delete that connection with the other users
router.post('/connnection/delete/:userId', function(req, res) {
  if (err) {
    res.status(400).render('connnection', {
      user: req.user,
      error: 'user id missing'
    });
  } else {
  	User.findById(req.user._id, function(err, user){
  		user.connection = user.connections.filter(function(x){
  			return x !== req.params.userid
  		})
  		user.save(function(err){
  			if(err) {res.status(400).json({message: "Failure by user, cannot delete"})
  		    }else{
  		      redirect('/connections' + req.user._id)
  		    }
  		})
  	})
  }
});

module.exports = router;