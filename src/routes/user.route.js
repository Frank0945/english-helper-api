const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const user = require("../services/user.service");

router.put("/set/nickname", controller(user.setUserNickname));

module.exports = router;
