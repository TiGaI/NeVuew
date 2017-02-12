var express = require('express');
var router = express.Router();

var Contact  = require('../models/models').Contact;


/* GET home page. */
router.get('/', function(req, res, next) {
  // Your code here.
  Contact.find(function(err, contacts){
    if(err){
      res.status(401).json(err);
    }
    res.render('home')
  });
});


module.exports = router;
