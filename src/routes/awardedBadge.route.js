const express = require("express");
const router = express.Router();
const controller = require("../controllers/awardedBadge.controller");

router.post("/awarded", controller.awardedBadge);
router.get("/list", controller.listBadgesByUserId);

module.exports = router;
