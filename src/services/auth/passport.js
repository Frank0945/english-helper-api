const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userService = require("../user.service");

require("dotenv").config();

function passportSetup(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.HOST_URL + "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      userService
        .getUserInfo({ user_id: profile.id })
        .then((result) => {
          if (result === null) {
            userService.setUserInfo({
              user_id: profile.id,
              email: profile.emails[0].value,
              nickname: profile.displayName,
              image_url: profile.photos[0].value,
            });
          }
          const userData = result ? setUserInfo(result) : setUserInfo(profile);
          return done(null, userData);
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("deserializeUser", user);
  done(null, user);
});

const setUserInfo = (profile) => {
  const userData = {};
  const fl = !profile.user_id; // is first login

  userData.user_id = fl ? profile.id : profile.user_id;
  userData.email = fl ? profile.emails[0].value : profile.email;
  userData.nickname = fl ? profile.displayName : profile.nickname;
  userData.image_url = fl ? profile.photos[0].value : profile.image_url;

  return userData;
};

module.exports = {
  passportSetup,
};
