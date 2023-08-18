const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controllers");
const article = require("../services/article.service");

router.post("/generate", controller(article.generateArticle));

module.exports = router;
