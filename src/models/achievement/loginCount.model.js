const { DataTypes } = require("sequelize");
const sequelize = require("../../services/_db.service").sequelize;

const LoginCounts = sequelize.define("login_counts", {
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

LoginCounts.sync().then(() => {});

module.exports = {
  LoginCounts,
};
