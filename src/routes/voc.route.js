const express = require("express");
const router = express.Router();
const controller = require("../controllers/voc.controller");

router.get("/dailyVocs", controller.getDaliyVocs);
router.put("/set/corrected", controller.setCorrected);
router.put("/set/marked", controller.setMarked);
router.put("/set/isUsed", controller.setIsUsed);
router.get("/list/notUsed", controller.listNotUsed);
router.get("/list/isUsed", controller.listIsUsed);
router.get("/list/isMarked", controller.listIsMarked);

module.exports = router;
