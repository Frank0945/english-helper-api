const { DataTypes } = require("sequelize");
const { QuizQuestions } = require("./quizQuestions.model");
const sequelize = require("../../services/db.service").sequelize;

const Quiz = sequelize.define(
  "quizzes",
  {
    articleId: {
      type: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.CHAR(30),
      allowNull: false,
    },
    voc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

QuizQuestions.belongsTo(Quiz, { foreignKey: "articleId" });
Quiz.hasMany(QuizQuestions, { foreignKey: "articleId", as: "questions" });

module.exports = {
  Quiz,
};
