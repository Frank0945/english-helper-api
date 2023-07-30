/**
 * The project structure refers to https://github.com/geshan/expressjs-structure
 *
 */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
require("./src/services/db.service");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const userRouter = require("./src/routes/user.route");
const awardedRouter = require("./src/routes/awardedBadge.route");
const userVocRouter = require("./src/routes/userVoc.route");

app.use("/user", userRouter);
app.use("/badge", awardedRouter);
app.use("/userVoc", userVocRouter);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
