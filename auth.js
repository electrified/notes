const passport = require("passport");
const db = require('./models');
const pass = require('./pass');

const LocalStrategy = require('passport-local').Strategy;

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.get('username'));
});

passport.deserializeUser(function(username, done) {
  new db.user({
    username: username
  }).fetch().then(function(user) {
    return done(null, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    new db.user({
      username: username
    }).fetch().then(function(user) {
      console.log('success');

      if (user === null) {
        return done(null, false, {
          message: "error"
        });
      }

      if (!pass.compareSync(password, user.get('password'))) {
        console.log('pass no match');
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      console.log('pass match');
      return done(null, user);
    }).error(function(err) {
      console.log('error');
      return done(null, false, {
        message: "error"
      });
    });
  }
));
