const { Quiz } = require("../models/quiz.model");

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

    return await Quiz.bulkCreate(cData);
  } catch (error) {
    console.error("error");
    throw error;
  }
}

// TODO: listQuizzes, limitQuizAmount, getQuizById

module.exports = {
  createQuiz,
};
