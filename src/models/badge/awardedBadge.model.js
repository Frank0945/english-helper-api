const { DataTypes } = require("sequelize");
const sequelize = require("../../services/db.service").sequelize;

const AwardedBadge = sequelize.define(
  "awarded_badges",
  {
    user_id: {
      type: DataTypes.CHAR(30),
      primaryKey: true,
      allowNull: false,
    },
    badge_id: {
      type: DataTypes.INET(11),
      primaryKey: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
);

module.exports = {
  AwardedBadge,
};
