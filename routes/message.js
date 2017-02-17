var express = require('express'),
router = express.Router(),
aws = require('aws-sdk'),
bodyParser = require('body-parser'),
multer = require('multer'),
multerS3 = require('multer-s3');

var User = require('../models/models').User;
var	EventCard = require('../models/models').EventCard;
var	Message  = require('../models/models').Message;


module.exports = function(io) {

	router.get('/conversation', function(req,res) {
		res.render('conversation', {user: req.user, message: {}});		
	});

	router.get('/conversation/:userid', function(req,res) {

		Message.find({ $or: [{user1: req.params.userid, user2: req.user._id}, 
				{user2: req.params.userid, user1: req.user._id}]})
			.sort('dateCreated').exec(function(err, message){
				if(err){
					res.send('invalid Message, conversation does not exist')
					res.redirect('/connections/req.user._id')
				}else{
					res.render('conversation', {user: req.user, message: message});
				}
			});	
	});



	// first time someone connects
	io.on('connection', function(socket){
	  socket.emit('userid', socket.request.session);
	});



		// io.on('connection', function (socket) {

		// 	// sockets.on('user', function (data) {
		// 	// console.log(data);
		// 	// });

		// 	// when the client emits 'sendchat', this listens and executes
		// 	socket.on('sendchat', function (data) {
		// 		// we tell the client to execute 'updatechat' with 2 parameters
		// 		io.sockets.emit('updatechat', socket.username, data);
		// 	});

		// 	// when the client emits 'adduser', this listens and executes
		// 	socket.on('adduser', function(username){
		// 		// we store the username in the socket session for this client
		// 		socket.username = username;
		// 		// add the client's username to the global list
		// 		usernames[username] = username;
		// 		// echo to client they've connected
		// 		socket.emit('updatechat', 'SERVER', 'you have connected');
		// 		// echo globally (all clients) that a person has connected
		// 		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// 		// update the list of users in chat, client-side
		// 		io.sockets.emit('updateusers', usernames);
		// 	});

		// 	// when the user disconnects.. perform this
		// 	socket.on('disconnect', function(){
		// 		// remove the username from global usernames list
		// 		delete usernames[socket.username];
		// 		// update list of users in chat, client-side
		// 		io.sockets.emit('updateusers', usernames);
		// 		// echo globally that this client has left
		// 		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		// 	});
		// });




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
return router;

}