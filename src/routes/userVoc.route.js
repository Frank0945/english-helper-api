const express = require("express");
const router = express.Router();
const controller = require("../controllers/userVoc.controller");

router.get("/dailyVoc", controller.getUserDaliyVoc);
router.post("/setUserCorrected", controller.setUserDaliyVocCorrected);

module.exports = router;
