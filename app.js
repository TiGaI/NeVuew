var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var models = require('./models/models');
var compression = require('compression');
//linking file
var routes = require('./routes/index');
var auth = require('./routes/auth');
var message = require('./routes/message');
var eventApi = require('./routes/event');
var other = require('./routes/other');

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var connect = process.env.MONGODB_URI || require('./models/connect');
// var userConnection = require('../userConnection')

mongoose.connect(connect);


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));

var hbs = require('express-handlebars')({
  defaultLayout: 'layout',
  extname: '.hbs'
});
app.engine('hbs', hbs);
app.set('view engine', 'hbs');

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var connect = process.env.MONGODB_URI || require('./models/connect');
// var userConnection = require('../userConnection')

mongoose.connect(connect);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport stuff here
var session = require('express-session');
var sessionMiddleware = session({
  secret: process.env.secret,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport strategy
passport.use(new LocalStrategy(function(username, password, done) {
    // Find the user with the given username
<<<<<<< HEAD
    models.User.findOne({ email: username }, function (err, user) {
=======
    console.log(username)

    models.User.findOne({ email: username }, function (err, user) {
      console.log(user)
>>>>>>> master
      // if there's an error, finish trying to authenticate (auth failed)
      console.log(user);
      if (err) {
        console.error(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        console.log(user);
        return done(null, false, { message: 'Incorrect username.' });
      }
      // if passwords do not match, auth failed
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // auth has has succeeded
      return done(null, user);
    });
  }
);

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
        
    console.log(profile);

        models.User.findOne({
            email: profile.emails[0].value
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                var fullName = profile.displayName.split(' ');
                var firstName = fullName[0];
                var lastName = fullName[fullName.length - 1];
                user = new models.User({
                    fname: firstName,
                    lname: lastName,
                    email: profile.emails[0].value, 
                    image: profile.photos ? profile.photos[0].value : 'http://shurl.esy.es/y'         
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            }else {
                //found user. Return
                return done(err, user);
            }
        });
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    profileFields: ['id', 'displayName', 'name', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
        User.findOne({
            '_id': profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                var fullName = profile.displayName.split(' ');
                var firstName = fullName[0];
                var lastName = fullName[fullName.length - 1];
                user = new User({
                    _id: profile.id,
                    fname: firstName,
                    lname: lastName,
                    email: profile.emails[0].value, 
                    image: profile.photos ? profile.photos[0].value : 'http://shurl.esy.es/y'         
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            }else {
                //found user. Return
                return done(err, user);
            }
        });
    }
));

// socket io middleware
io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});


app.use('/', auth(passport));
app.use('/', routes);
app.use('/', event);
app.use('/', message(io));
app.use('/', other);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});