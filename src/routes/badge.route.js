const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const awardedBadge = require("../services/badge.service");

router.get("/list", controller(awardedBadge.listBadgesByUserId));

module.exports = router;
