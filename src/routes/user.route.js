const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const user = require("../services/user.service");
const { isLogin } = require("../filters/auth");

router.get("/session", (req, res) => {
  return res.send(isLogin(req) ? req.session.passport.user : {});
});
router.put("/update/nickname", controller(user.setUserNickname));

module.exports = router;
