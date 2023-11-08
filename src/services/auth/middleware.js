const session = require("express-session");
require("dotenv").config();

function middlewareSetup(app) {
  app.use(
    session({
      secret: process.env.GOOGLE_CLIENT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: process.env.CLIENT_DOMAIN,
      }
    })
  );
}

module.exports = {
  middlewareSetup,
};
