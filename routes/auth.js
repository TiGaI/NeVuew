"use strict";
// Add Passport-related auth routes here.
var express = require('express');
var router = express.Router();
var models = require('../models/models');
var fromPhone = process.env.FROM_PHONE;
var mongoose = require('mongoose')

module.exports = function(passport) {


  // GET Login page
  router.get('/', function(req, res) {
    res.render('login', {
    error: req.query.error,
    msg: req.query.msg
    });
  });

  // POST Login page
  router.post('/', passport.authenticate('local', {
            successRedirect: '/makeEvent',
            failureRedirect: '/login'
        }))

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  router.post('/signup', function(req, res) {
    var user = new models.User({
      fname: req.body.fname,
      lname: req.body.lname,
      password: req.body.password,
      email: req.body.email
    })
    user.save();
    res.render('login');
  });

  router.post('/login', passport.authenticate('local'), function(req, res){
    models.User.findById(req.user._id).exec(function(err, user){
      // console.log('2')
      user.findSeenEvents(function(err, events){
        models.EventCard.find({_id:{"$nin": events}})
        .sort({eventStartTime: -1})
        .limit(10)
        .exec(
          err, function(err, eventsQueue){
            if (err){
              res.send(err)
            }
            // console.log(eventsQueue)
            // console.log(eventsQueue);
            res.render('eventSwipe', {eventsQueue: eventsQueue})
          })
      })
    })
  });

  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/login2', function(req, res) {
    // console.log(req.body)
    var fields = ['fname', 'lname', 'email', 'password', 'passwordRepeat']
    for (var i = 0; i < fields.length; i++) {
      // console.log(fields[i])
      var field = fields[i];
      if (! req.body[field]) {
        res.status(400).render('signup', {
          error: field + ' is required.'
        });
        return;
      }
    }
    // validation step
    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    // console.log(req.body);
    var u = new models.User({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password,
    });
    // console.log('u')
    u.save(function(err) {
      if (err) {
        // console.log('in err')
          if (err.errmsg.indexOf('E11000') > -1) {
            err = 'email is already taken: ' + req.body.email;
          } else {
            err = err.errmsg;
          }
          res.status(400).render('signup', {
            error: err
          })
      }
      // console.log(user);
      res.redirect('/eventSwipe');
    });
      res.redirect('/eventSwipe');
  });


  router.post('/login3',
    passport.authenticate('local'), function(req, res){
      res.redirect('/eventSwipe')
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  // FACEBOOK

  router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: [ 'email' ] }));

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
          models.User.findById(req.user._id).exec(function(err, user){
      // console.log('2')
      user.findSeenEvents(function(err, events){
        models.EventCard.find({_id:{"$nin": events}})
        .sort({eventStartTime: -1})
        .limit(10)
        .exec(
          err, function(err, eventsQueue){
            if (err){
              res.send(err)
            }
            // console.log(eventsQueue)
            res.render('eventSwipe', {eventsQueue: eventsQueue})
          })
      })
    })
  });

    router.get('/auth/google',
      passport.authenticate('google', { scope: ['profile'] }));

    router.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
            models.User.findById(req.user._id).exec(function(err, user){
      // console.log('2')
      user.findSeenEvents(function(err, events){
        models.EventCard.find({_id:{"$nin": events}})
        .sort({eventStartTime: -1})
        .limit(10)
        .exec(
          err, function(err, eventsQueue){
            if (err){
              res.send(err)
            }
            // console.log(eventsQueue)
            res.render('eventSwipe', {eventsQueue: eventsQueue})
          })
      })
    })
      });

  return router;
};
