const { DataTypes } = require("sequelize");
const sequelize = require("../../services/_db.service").sequelize;

const vocHistory = sequelize.define(
  "voc_history",
  {
    userId: {
      type: DataTypes.CHAR(30),
      primaryKey: true,
      allowNull: false,
    },
    voc: {
      type: DataTypes.CHAR(50),
      primaryKey: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      hasDefault: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = {
  vocHistory,
};
