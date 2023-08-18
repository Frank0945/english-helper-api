const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const voc = require("../services/voc.service");

router.get("/dailyvoc", controller(voc.getDaliyvoc));
router.put("/set/corrected", controller(voc.setCorrected));
router.put("/set/marked", controller(voc.setMarked));
router.put("/set/isUsed", controller(voc.setIsUsed));
router.get("/list/notUsed", controller(voc.listNotUsed));
router.get("/list/isUsed", controller(voc.listIsUsed));
router.get("/list/isMarked", controller(voc.listIsMarked));

module.exports = router;
