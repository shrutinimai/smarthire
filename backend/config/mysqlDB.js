const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log(" MySQL connected successfully");
    await sequelize.sync({ alter: true });
    console.log(" MySQL tables synced");
  } catch (error) {
    console.error(" MySQL connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectMySQL };