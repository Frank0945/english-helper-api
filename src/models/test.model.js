const { DataTypes } = require('sequelize');
const sequelize = require('../services/db.service').sequelize;

const Test = sequelize.define('all_achievements', {
    badge_id: {
        type: DataTypes.INET(11),
        primaryKey: true,
        allowNull: false
    },
    badge_name: {
        type: DataTypes.CHAR(30),
        allowNull: false
    },
    requirement: {
        type: DataTypes.CHAR(100),
        allowNull: false
    }
}, {
    timestamps: false,
});

module.exports = {
    Test,
};