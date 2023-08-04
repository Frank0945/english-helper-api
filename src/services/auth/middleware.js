const session = require("express-session");
require("dotenv").config();

function middlewareSetup(app) {
  app.use(
    session({
      secret: process.env.GOOGLE_CLIENT_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
}

module.exports = {
  middlewareSetup,
};
