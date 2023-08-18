const { DataTypes } = require("sequelize");
const sequelize = require("../../services/db.service").sequelize;

const AwardedBadge = sequelize.define("awarded_badges", {
  userId: {
    type: DataTypes.CHAR(30),
    primaryKey: true,
    allowNull: false,
  },
  badgeId: {
    type: DataTypes.INET(11),
    primaryKey: true,
    allowNull: false,
  },
});

module.exports = {
  AwardedBadge,
};
