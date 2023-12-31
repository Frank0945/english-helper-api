const { DataTypes } = require("sequelize");
const sequelize = require("../../services/_db.service").sequelize;

const Voc = sequelize.define(
  "vocabulary",
  {
    userId: {
      type: DataTypes.CHAR(30),
      primaryKey: true,
      allowNull: false,
    },
    vocId: {
      type: DataTypes.INET(4),
      primaryKey: true,
      allowNull: false,
    },
    correct: {
      type: DataTypes.BOOLEAN,
    },
    marked: {
      type: DataTypes.BOOLEAN,
      zeroFill: true,
    },
    used: {
      type: DataTypes.BOOLEAN,
      zeroFill: true,
    },
    addFromDaily: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = {
  Voc,
};
