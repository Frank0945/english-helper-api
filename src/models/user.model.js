const { DataTypes } = require("sequelize");
const sequelize = require("../services/db.service").sequelize;

const User = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.CHAR(30),
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
    learning_time: {
      type: DataTypes.INET(4),
      allowNull: true,
      zeroFill: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  User,
};
