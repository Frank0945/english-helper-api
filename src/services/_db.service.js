const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mariadb",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      connectTimeout: 40 * 1000, // 40 seconds connect timeout
    },
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    throw new Error("Unable to connect to the database:", error);
  });

module.exports = {
  sequelize,
};
