const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE, process.env.NAME, process.env.PASSWORD, {
    dialect: 'mariadb',
    host: process.env.HOST,
    port: process.env.PORT,
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = {
    sequelize,
};