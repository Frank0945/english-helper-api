const { DataTypes } = require("sequelize");
const sequelize = require("../services/db.service").sequelize;

const Quiz = sequelize.define(
  "quizzes",
  {
    articleId: {
      type: DataTypes.INET(10),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.CHAR(30),
      allowNull: false,
    },
    vocs: {
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
    ans1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ans2: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ans3: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ans4: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    choice: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
    },
    correctAns: {
      type: DataTypes.TINYINT(1),
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

module.exports = {
  Quiz,
};
