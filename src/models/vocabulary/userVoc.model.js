const { DataTypes } = require("sequelize");
const sequelize = require("../../services/db.service").sequelize;

const UserVoc = sequelize.define("user_vocabularies", {
  user_id: {
    type: DataTypes.INET(11),
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
    allowNull: false,
  },
});

module.exports = {
  UserVoc,
};
