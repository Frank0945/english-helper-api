const { DataTypes } = require("sequelize");
const sequelize = require("../../services/db.service").sequelize;

const VocsHistory = sequelize.define(
  "vocs_history",
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
  VocsHistory,
};
