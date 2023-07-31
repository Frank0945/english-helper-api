const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const { authenticateToken } = require("../services/auth/middleware");

router.post("/new", controller.setUserInfo);
router.get(
  "/getInfo",
  controller.getUserInfo
);
router.post("/setNickname", controller.setUserNickname);

module.exports = router;
