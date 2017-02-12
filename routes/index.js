var express = require('express');
var router = express.Router();
var Contact  = require('../models/models').Contact;


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home')
});


module.exports = router;
