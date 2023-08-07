const { DataTypes } = require("sequelize");
const sequelize = require("../../services/db.service").sequelize;

const Voc = sequelize.define(
  "vocabularies",
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
    corrected: {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      hasDefault: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  Voc,
};
