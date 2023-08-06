const { DataTypes } = require("sequelize");
const sequelize = require("../../services/db.service").sequelize;

const UserVoc = sequelize.define("user_vocabularies", {
  user_id: {
    type: DataTypes.CHAR(30),
    primaryKey: true,
    allowNull: false,
  },
  voc_id: {
    type: DataTypes.INET(4),
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
  corrected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  marked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = {
  UserVoc,
};
