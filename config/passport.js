// Passport GitHub strategy setup
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
          console.log('found', found);
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

      // const findOrCreateUser = async () => {
      //   user = await User.find({ githubId: id });

      //   if (user) return user; // User already exixsts - no need to store it again

      //   user = await User.create({
      //     githubId: id,
      //     displayName,
      //     username,
      //     profileUrl,
      //     profileImg: photos[0].value,
      //   });

      //   return user;
      // };

      // const user = {
      //   id,
      //   displayName,
      //   username,
      //   profileUrl,
      //   profileImg: photos[0].value,
      // };

      // return cb(null, storedUser);

      // console.log(profile);
      // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  )
);
