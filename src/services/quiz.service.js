const { Quiz } = require("../models/quiz/quiz.model");
const { QuizQuestions } = require("../models/quiz/quizQuestions.model");
const sequelize = require("./_db.service").sequelize;
const { Op } = require("sequelize");

const maxQuizAmount = 20;

async function listQuizzes(_, userId) {
  /** Destroy the empty choices */
  try {
    await Quiz.destroy({
      where: {
        userId,
        articleId: {
          [Op.in]: sequelize.literal(
            "(SELECT DISTINCT articleId FROM quiz_questions WHERE choice IS NULL)",
          ),
        },
      },
    });

    return await Quiz.findAll({
      where: {
        userId,
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
              "CASE WHEN questions.choice = questions.correct THEN 1 ELSE 0 END",
            ),
          ),
          "correct",
        ],
        "createdAt",
      ],
      order: [["articleId", "DESC"]],
      group: ["quizzes.articleId"],
    });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * @param {Array<{
 *  voc: string,
 *  title: string,
 *  content: string,
 *  questions: Array<{
 *    question: string,
 *    option1: string,
 *    option2: string,
 *    option3: string,
 *    option4: string,
 *    correct: number,
 *    choice: number,
 * }>
 * }>} data
 */
async function createQuiz(data, userId) {
  const t = await sequelize.transaction();

  try {
    const cQuiz = data.map((row) => {
      return {
        userId,
        title: row.title,
        content: row.content,
        voc: row.voc,
      };
    });

    const quizRtn = await Quiz.bulkCreate(cQuiz, { transaction: t });

    const articleIds = [];

    quizRtn.forEach((q) => {
      articleIds.push(q.dataValues.articleId);
    });

    const cQuestions = data.flatMap((quiz, idx) => {
      return quiz.questions.map((row, qNumber) => {
        return {
          articleId: articleIds[idx],
          qNumber,
          ...row,
        };
      });
    });

    const quizQuestionsRtn = await QuizQuestions.bulkCreate(cQuestions, {
      transaction: t,
    });

    const qIds = [];
    quizQuestionsRtn.forEach((q) => {
      qIds.push(q.dataValues.qId);
    });

    await t.commit();
    return qIds;
  } catch (error) {
    await t.rollback();
    throw new Error(error);
  }
}

/**
 * @param {Array<{
 *   qId: string,
 *   choice: number
 * }>} data
 */
async function updateQuizChoice(data, userId) {
  const t = await sequelize.transaction();
  try {
    for (const update of data) {
      await QuizQuestions.update(
        { choice: update.choice },
        {
          where: { qId: update.qId },
          transaction: t,
        },
      );
    }

    await limitQuizAmount(userId, t);

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

async function cancelQuiz(data) {
  try {
    return await Quiz.destroy({
      where: {
        articleId: data.articleId,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function limitQuizAmount(userId, t) {
  try {
    const query = `
    DELETE FROM quizzes
    WHERE userId = ${userId} AND articleId IN (
      SELECT articleId
      FROM (
        SELECT articleId, ROW_NUMBER() OVER (ORDER BY articleId DESC) AS row_num
        FROM quizzes
        WHERE userId = ${userId}
      ) AS subquery
      WHERE row_num > ${maxQuizAmount}
    );
  `;
    return await sequelize.query(query, { transaction: t });
  } catch (error) {
    throw new Error(error);
  }
}

async function getQuizById(data) {
  try {
    return await Quiz.findOne({
      where: {
        articleId: data.articleId,
      },
      attributes: {
        exclude: ["userId", "createdAt"],
      },
      include: [
        {
          model: QuizQuestions,
          as: "questions",
          findAll: true,
          attributes: {
            exclude: ["articleId", "qNumber"],
          },
          order: ["qNumber", "ASC"],
        },
      ],
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  listQuizzes,
  createQuiz,
  getQuizById,
  updateQuizChoice,
  cancelQuiz,
};
