const { DataTypes } = require("sequelize");
const sequelize = require("../../services/_db.service").sequelize;

const QuizQuestions = sequelize.define(
  "quiz_questions",
  {
    qId: {
      type: DataTypes.UUIDV1,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    articleId: {
      type: DataTypes.UUIDV1,
      allowNull: false,
      key: true,
    },
    qNumber: {
      type: DataTypes.INET(1),
      allowNull: false,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    option1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    option2: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    option3: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    option4: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    correct: {
      type: DataTypes.INET(1),
      allowNull: false,
    },
    choice: {
      type: DataTypes.INET(1),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  QuizQuestions,
};
