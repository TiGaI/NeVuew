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
  res.render('button-test');
});


module.exports = router;
