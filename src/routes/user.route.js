const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

router.post("/new", controller.setUserInfo);
router.get("/get/info", controller.getUserInfo);
router.put("/set/nickname", controller.setUserNickname);

module.exports = router;
