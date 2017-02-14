var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');
var router = express.Router();

var User  = require('../models/models').User;
var Event  = require('../models/models').Event;



aws.config.update({
    secretAccessKey: aweskey,
    accessKeyId: awekeyid,
    region: 'us-east-1'
});

var s3 = new aws.S3();

router.use(multer({
  dest: './public/uploads/', 
  limits : { fileSize:100000 },
  rename: function (fieldname, filename) {
    return filename.replace(/\W+/g, '-').toLowerCase();
  },
  onFileUploadData: function (file, data, req, res) {
    // file : { fieldname, originalname, name, encoding, mimetype, path, extension, size, truncated, buffer }
    var params = {
      Bucket: 'makersquest',
      Key: file.name,
      Body: data
    };

    s3.putObject(params, function (perr, pres) {
      if (perr) {
        console.log("Error uploading data: ", perr);
      } else {
        console.log("Successfully uploaded data to myBucket/myKey");
      }
    });
  }
}));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home')
});


router.post('/event', function(req, res){
  

  var imgSave = function() {
    var book_img = req.file.location;
    var book_desc = req.body.book_desc;

    var data = new BookModel({
      user_id   : token_user_id,
      book_img  : book_img,
      book_desc : book_desc
    });

    data.save(function(err, docs) {
      if (err) { return next(err); }
      res.json({ success: 1, message: "photo is uploaded" });
    });
  };
});


module.exports = router;
