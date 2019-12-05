const GithubStrategy = require('passport-github').Strategy;
const passport = require('passport')
const id = require('./oauth');

passport.use(
  new GithubStrategy(
    {
      clientID: id.github.clientID,
      clientSecret: id.github.clientSecret,
      callbackURL: 'http://localhost:8000/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
      Users.findOrCreate({ githubId: profile.id }, function(err, user) {
        return cb(err, user);
      });
    }
  )
);