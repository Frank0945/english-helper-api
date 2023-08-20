const { DataTypes } = require("sequelize");
const { AwardedBadge } = require("./awardedBadge.model");
const sequelize = require("../../services/_db.service").sequelize;

const Badges = sequelize.define(
  "badges",
  {
    badgeId: {
      type: DataTypes.INET(11),
      primaryKey: true,
      allowNull: false,
    },
    badgeName: {
      type: DataTypes.CHAR(30),
      allowNull: false,
    },
    requirement: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
    badgeIcon: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

AwardedBadge.belongsTo(Badges, { foreignKey: "badgeId" });
Badges.hasMany(AwardedBadge, { foreignKey: "badgeId" });

module.exports = {
  Badges,
};
