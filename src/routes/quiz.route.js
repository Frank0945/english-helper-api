const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const quiz = require("../services/quiz.service");

router.post("/create", controller(quiz.createQuiz));

module.exports = router;
