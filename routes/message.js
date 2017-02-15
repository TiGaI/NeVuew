var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');
var router = express.Router();

var User  = require('../models/models').User;
var Card  = require('../models/models').Card;
var Message  = require('../models/models').Message;

/* GET home page. */
router.post('/', function(req, res){
  
});


module.exports = router;