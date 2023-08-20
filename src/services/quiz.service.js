const { Quiz } = require("../models/quiz/quiz.model");
const { QuizQuestions } = require("../models/quiz/quizQuestions.model");
const sequelize = require("./db.service").sequelize;
const { Op } = require("sequelize");

const maxQuizAmount = 20;

async function listQuizzes(data) {
  /** Destroy the empty choices */
  try {
    await Quiz.destroy({
      where: {
        userId: data.userId,
        articleId: {
          [Op.in]: sequelize.literal(
            "(SELECT DISTINCT articleId FROM quiz_questions WHERE choice IS NULL)"
          ),
        },
      },
    });

    return await Quiz.findAll({
      where: {
        userId: data.userId,
      },
      include: [
        {
          model: QuizQuestions,
          as: "questions",
          attributes: [],
        },
      ],
      attributes: [
        "articleId",
        "title",
        "voc",
        [sequelize.fn("COUNT", sequelize.col("questions.qId")), "total"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              "CASE WHEN questions.choice = questions.correct THEN 1 ELSE 0 END"
            )
          ),
          "corrected",
        ],
      ],
      order: [["articleId", "DESC"]],
      group: ["quizzes.articleId"],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * @param {{
 *  userId: string,
 *  quizzes: Array<{
 *    quiz: {
 *      voc: string,
 *      title: string,
 *      content: string,
 *    },
 *    questions: Array<{
 *      question: string,
 *      option1: string,
 *      option2: string,
 *      option3: string,
 *      option4: string,
 *      correct: number,
 *      choice: number,
 *    }>
 *  }>}} data
 */
async function createQuiz(data) {
  const t = await sequelize.transaction();

  try {
    const cQuiz = data.quizzes.map((row) => {
      return {
        userId: data.userId,
        ...row.quiz,
      };
    });

    const quizRtn = await Quiz.bulkCreate(cQuiz, { transaction: t });

    const articleIds = [];

    quizRtn.forEach((q) => {
      articleIds.push(q.dataValues.articleId);
    });

    const cQuestions = data.quizzes.flatMap((quiz, idx) => {
      return quiz.questions.map((row, qNumber) => {
        return {
          articleId: articleIds[idx],
          qNumber,
          ...row,
        };
      });
    });

    await QuizQuestions.bulkCreate(cQuestions, { transaction: t });
    await t.commit();
    return true;
  } catch (error) {
    console.error(error);
    await t.rollback();
    throw error;
  }
}

/**
 * @param {Array<{
 *   qId: string,
 *   choice: number
 * }>} data
 */
async function updateQuizChoice(data) {
  const t = await sequelize.transaction();
  try {
    for (const update of data.quizzes) {
      await QuizQuestions.update(
        { choice: update.choice },
        {
          where: { qId: update.qId },
          transaction: t,
        }
      );
    }

    await limitQuizAmount(data, t);

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

async function cancelQuiz(data) {
  await Quiz.destroy({
    where: {
      articleId: data.articleId,
    },
  });
}

async function limitQuizAmount(data, t) {
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
  await sequelize.query(query, { transaction: t });
}

async function getQuizById(data) {
  return await Quiz.findOne({
    where: {
      articleId: data.articleId,
    },
    attributes: {
      exclude: ["articleId", "userId"],
    },
    include: {
      model: QuizQuestions,
      findAll: true,
      attributes: {
        exclude: ["articleId", "qNumber"],
      },
    },
    order: [[QuizQuestions, "qNumber", "ASC"]],
  });
}

module.exports = {
  listQuizzes,
  createQuiz,
  getQuizById,
  updateQuizChoice,
  cancelQuiz,
};
