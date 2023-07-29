const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

router.post("/new", controller.setUserInfo);

module.exports = router;
