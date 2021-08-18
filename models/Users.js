const DB = require('./connect');
const Sequelize = require("sequelize");

module.exports = DB.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    email: {
      unique:true,
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
  });