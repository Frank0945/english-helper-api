const { DataTypes } = require("sequelize");
const { AwardedBadge } = require("./awardedBadge.model");
const sequelize = require("../../services/db.service").sequelize;

const Badges = sequelize.define(
  "badges",
  {
    badge_id: {
      type: DataTypes.INET(11),
      primaryKey: true,
      allowNull: false,
    },
    badge_name: {
      type: DataTypes.CHAR(30),
      allowNull: false,
    },
    requirement: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
    badge_icon: {
      type: DataTypes.CHAR(100),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

AwardedBadge.belongsTo(Badges, { foreignKey: "badge_id" });
Badges.hasMany(AwardedBadge, { foreignKey: "badge_id" });

module.exports = {
  Badges,
};
