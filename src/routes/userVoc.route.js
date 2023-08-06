const express = require("express");
const router = express.Router();
const controller = require("../controllers/userVoc.controller");

router.get("/dailyVocs", controller.getDaliyVocs);
router.post("/set/isCorrected", controller.setIsCorrected);
router.post("/set/marked", controller.setMarked);
router.post("/set/isUsed", controller.setIsUsed);
router.get("/list/notUsed", controller.listNotUsed);
router.get("/list/isUsed", controller.listIsUsed);
router.get("/list/isMarked", controller.listIsMarked);

module.exports = router;
