var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var connect = process.env.MONGODB_URI || require('./connect');
var express = require('express')


mongoose.connect(connect);

var User = mongoose.Schema({
  name: String,
  created: Date,
  email: String,
  image: String,
  admin: {
  	type: Boolean,
  	default: true
  }
});

var Card = mongoose.Schema({
  title: String,
  coordinator: String,
  de: String,
  CardTime: Date,
  CardAddress: String,
  created: Date,
  image: Array,
  // category: String
});

var Message = mongoose.Schema({
	body: {
      type: String,
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    }
});

Card.plugin(crate, {
    storage: new S3({
        key: process.env.KEY,
        secret: process.env.SECRET,
        bucket: process.env.BUCKET,
        acl: 'public-read', // defaults to public-read
        region: 'eu-west-1', // defaults to us-standard
        path: function(attachment) { // where the file is stored in the bucket - defaults to this function
            return '/' + attachment.name
        }
    }),
    fields: {
        file: {}
    }
});

module.exports = {
    Card: mongoose.model('Card', Card),
    Message: mongoose.model("Message", Message),
    User: mongoose.model("User", User)
};