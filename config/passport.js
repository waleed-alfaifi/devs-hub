const GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      function (accessToken, refreshToken, profile, cb) {
        const { id, displayName, username, photos, profileUrl } = profile;

        User.findOne({ githubId: id })
          .then((found) => {
            // User already exists in db
            if (found) return cb(null, found);

            // Create a new user in db
            User.create({
              githubId: id,
              displayName,
              username,
              profileUrl,
              profileImg: photos[0].value,
            })
              .then((user) => {
                return cb(null, user);
              })
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
