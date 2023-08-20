const { DataTypes } = require("sequelize");
const { Voc } = require("./voc.model");
const sequelize = require("../../services/_db.service").sequelize;

const RegularVoc = sequelize.define(
  "regular_vocabulary",
  {
    vocId: {
      type: DataTypes.INET(4),
      primaryKey: true,
      allowNull: false,
    },
    vocabulary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    explain: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

Voc.belongsTo(RegularVoc, { foreignKey: "vocId" });
RegularVoc.hasMany(Voc, { foreignKey: "vocId" });

module.exports = {
  RegularVoc,
};
