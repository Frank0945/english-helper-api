const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
require("./src/services/db.service");
const { passportSetup } = require("./src/services/auth/passport");
const { middlewareSetup } = require("./src/services/auth/middleware");

middlewareSetup(app);
passportSetup(app);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const userRouter = require("./src/routes/user.route");
const awardedRouter = require("./src/routes/awardedBadge.route");
const vocRouter = require("./src/routes/voc.route");
const vocsHistoryRouter = require("./src/routes/vocsHistory.route");

app.use("/user", userRouter);
app.use("/badge", awardedRouter);
app.use("/voc", vocRouter);
app.use("/vocsHistory", vocsHistoryRouter);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use((err, req, res, next) => {
  res.status(500).json(err);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
