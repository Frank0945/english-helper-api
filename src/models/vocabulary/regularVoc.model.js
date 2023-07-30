const { DataTypes } = require("sequelize");
const { UserVoc } = require("./userVoc.model");
const sequelize = require("../../services/db.service").sequelize;

const RegularVoc = sequelize.define(
  "regular_vocabularies",
  {
    voc_id: {
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
    }
  },
  {
    timestamps: false,
  }
);

UserVoc.belongsTo(RegularVoc, { foreignKey: "voc_id" });
RegularVoc.hasMany(UserVoc, { foreignKey: "voc_id" });

module.exports = {
  RegularVoc,
};
