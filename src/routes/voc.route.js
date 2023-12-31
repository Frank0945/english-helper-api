const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const voc = require("../services/vocabulary/voc.service");

router.get("/daily", controller(voc.getDaliyvoc));
router.put("/set/correct", controller(voc.setCorrect));
router.post("/set/marked", controller(voc.setMarked));
router.post("/set/isUsed", controller(voc.setIsUsed));
router.get("/list/notUsed", controller(voc.listNotUsed));
router.get("/list/isUsed", controller(voc.listIsUsed));
router.get("/list/isMarked", controller(voc.listIsMarked));

module.exports = router;
