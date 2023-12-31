const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("./src/services/_db.service");
const { passportSetup } = require("./src/services/auth/passport");
const { middlewareSetup } = require("./src/services/auth/middleware");
require("dotenv").config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

middlewareSetup(app);
passportSetup(app);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const userRouter = require("./src/routes/user.route");
const badgeRouter = require("./src/routes/badge.route");
const vocRouter = require("./src/routes/voc.route");
const vocHistoryRouter = require("./src/routes/vocHistory.route");
const articleRouter = require("./src/routes/article.route");
const quizRouter = require("./src/routes/quiz.route");
const achievementRouter = require("./src/routes/achievement.route");

app.use("/user", userRouter);
app.use("/user/badge", badgeRouter);
app.use("/voc", vocRouter);
app.use("/voc/history", vocHistoryRouter);
app.use("/article", articleRouter);
app.use("/quiz", quizRouter);
app.use("/achievement", achievementRouter);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
  res
    .status(500)
    .json(
      err instanceof Error
        ? { message: err.message }
        : { message: err.toString(), errorUndefined: true },
    );
});

app.listen(process.env.HOST_PORT, () => {
  console.log(`Listening on port ${process.env.HOST_PORT}`);
});

module.exports = app;
