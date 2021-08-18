const DB = require('./connect');
const Sequelize = require("sequelize");

module.exports = DB.define("Actor", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });