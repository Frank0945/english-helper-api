const sequelize = require("../services/_db.service").sequelize;
const { DataTypes } = require("sequelize");

const Session = sequelize.define("session", {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  data: DataTypes.TEXT,
  expires: DataTypes.DATE,
});

module.exports = {
  Session,
};
