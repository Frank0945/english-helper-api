const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

router.post("/new", controller.setUserInfo);
router.get("/getInfo", controller.getUserInfo);
router.post("/setNickname", controller.setUserNickname);

module.exports = router;
