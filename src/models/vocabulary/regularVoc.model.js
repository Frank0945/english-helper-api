const { DataTypes } = require("sequelize");
const { Voc } = require("./voc.model");
const sequelize = require("../../services/db.service").sequelize;

const RegularVoc = sequelize.define(
  "regular_vocabularies",
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
  }
);

Voc.belongsTo(RegularVoc, { foreignKey: "vocId" });
RegularVoc.hasMany(Voc, { foreignKey: "vocId" });

module.exports = {
  RegularVoc,
};
