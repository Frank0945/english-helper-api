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

const testRouter = require("./src/routes/test.route");
const userRouter = require("./src/routes/user.route");

app.use("/test", testRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
