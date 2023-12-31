const { DataTypes } = require("sequelize");
const sequelize = require("../services/_db.service").sequelize;

const User = sequelize.define(
  "users",
  {
    userId: {
      type: DataTypes.CHAR(30),
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.CHAR(50),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
    learningTime: {
      type: DataTypes.INET(5),
      allowNull: true,
      zeroFill: true,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = {
  User,
};
