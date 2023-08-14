const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const quiz = require("../services/quiz.service");

router.get("/", controller(quiz.getQuizById));
router.get("/list", controller(quiz.listQuizzes));
router.post("/create", controller(quiz.createQuiz));

module.exports = router;
