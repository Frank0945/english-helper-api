const { DataTypes } = require("sequelize");
const sequelize = require("../../services/_db.service").sequelize;

const Achievements = sequelize.define("achievements", {
  userId: {
    type: DataTypes.CHAR(30),
    primaryKey: true,
    allowNull: false,
  },
  loginCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Achievements.sync().then(() => {});

module.exports = {
  Achievements,
};
