const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const vocHistory = require("../services/vocHistory.service");

router.get("/list", controller(vocHistory.listHistoryvoc));
router.post("/add", controller(vocHistory.addvoc));
router.delete("/remove", controller(vocHistory.removeVoc));

module.exports = router;
