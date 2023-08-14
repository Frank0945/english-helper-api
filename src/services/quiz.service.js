const { Quiz } = require("../models/quiz.model");

const maxQuizAmount = 20;

async function listQuizzes(data) {
  return await Quiz.findAll({
    where: {
      userId: data.userId,
    },
    attributes: ["articleId", "title", "vocs", "createdAt"],
    order: [["articleId", "DESC"]],
  });
}

/**
 * @param {{quizzes: Array<object>}} data
 */
async function createQuiz(data) {
  try {
    const cData = data.quizzes.map((row) => {
      return {
        userId: data.userId,
        ...row,
      };
    });
    await Quiz.bulkCreate(cData);
    await limitQuizAmount(data);
    return cData;
  } catch (error) {
    console.error("error");
    throw error;
  }
}

async function limitQuizAmount(data) {
  try {
    const quizCount = await Quiz.count({
      where: {
        userId: data.userId,
      },
    });
    if (quizCount > maxQuizAmount) {
      await Quiz.destroy({
        where: {
          userId: data.userId,
        },
        limit: quizCount - maxQuizAmount,
        order: [["articleId", "ASC"]],
      });
    }
  } catch (error) {
    console.error("error");
    throw error;
  }
}

async function getQuizById(data) {
  return await Quiz.findOne({
    where: {
      articleId: data.articleId,
      userId: data.userId,
    },
  });
}

module.exports = {
  listQuizzes,
  createQuiz,
  getQuizById,
};
