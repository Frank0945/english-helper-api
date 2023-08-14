const { Quiz } = require("../models/quiz.model");
const sequelize = require("./db.service").sequelize;

const maxQuizAmount = 20;

async function listQuizzes(data) {
  return await Quiz.findAll({
    where: {
      userId: data.userId,
    },
    attributes: ["articleId", "title", "voc", "createdAt"],
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
    const query = `
    DELETE FROM quizzes
    WHERE userId = ${data.userId} AND articleId IN (
      SELECT articleId
      FROM (
        SELECT articleId, ROW_NUMBER() OVER (ORDER BY articleId DESC) AS row_num
        FROM quizzes
        WHERE userId = ${data.userId}
      ) AS subquery
      WHERE row_num > ${maxQuizAmount}
    );
  `;
    await sequelize.query(query);
  } catch (error) {
    console.error("error");
    throw error;
  }
}

async function getQuizById(data) {
  return await Quiz.findOne({
    where: {
      articleId: data.articleId,
    },
  });
}

module.exports = {
  listQuizzes,
  createQuiz,
  getQuizById,
};
