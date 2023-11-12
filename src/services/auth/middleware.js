const session = require("express-session");
const { Session } = require("../../models/session.model");
require("dotenv").config();
const sequelize = require("../_db.service").sequelize;
const SequelizeStore = require("connect-session-sequelize")(session.Store);

function middlewareSetup(app) {
  app.use(
    session({
      secret: process.env.GOOGLE_CLIENT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: process.env.CLIENT_DOMAIN,
        maxAge: 24 * 60 * 60 * 1000 * 30 * 12 * 1, // 1 year
      },
      store: new SequelizeStore({
        db: sequelize,
        table: "session",
        extendDefaultFields: (defaults, session) => ({
          expires: new Date(Date.now() + session.cookie.maxAge),
          data: defaults.data,
        }),
      }),
    }),
  );
}

Session.sync().then(() => {});

module.exports = {
  middlewareSetup,
};
