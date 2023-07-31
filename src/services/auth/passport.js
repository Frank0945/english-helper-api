const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const user = require("../user.service");
const jwt = require("jsonwebtoken");

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
      console.log(accessToken);
      user.getUserInfo({ user_id: profile.id }).then((result) => {
        if (result === null) {
          user.setUserInfo({
            user_id: profile.id,
            email: profile.emails[0].value,
            nickname: profile.displayName,
            image_url: profile.photos[0].value,
          });
        }
      });
      const token = jwt.sign({ sub: profile.id }, process.env.JWT_SECRET_KEY);
      profile.token = token;
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log(user);

  done(null, user);
});

module.exports = {
  passportSetup,
};
