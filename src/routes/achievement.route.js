const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const { loginCount } = require("../services/achievements/loginCount");

router.get("/daily/check-in", controller(loginCount));

module.exports = router;
