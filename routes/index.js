var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');
var router = express.Router();

var User  = require('../models/models').User;
var Event  = require('../models/models').Event;


/* GET home page. */
router.get('/', function(req, res){

});

router.get('/events', function(req,res){
	res.render('event');
});

router.get('/profile', function(req,res){
	res.render('profile');
});
router.get('/eventSwipe', function(req,res){
	res.render('eventSwipe');
});
router.get('/login2', function(req,res){
	res.render('login2');
});
router.get('/message', function(req,res){
	res.render('message');
});
router.get('/conversation', function(req,res) {
	res.render('conversation');
});


module.exports = router;
