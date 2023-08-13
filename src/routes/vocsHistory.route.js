const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const vocsHistory = require("../services/vocsHistory.service");

router.get("/list", controller(vocsHistory.listHistoryVocs));
router.post("/add", controller(vocsHistory.addVoc));
router.delete("/remove", controller(vocsHistory.removeVoc));

module.exports = router;
