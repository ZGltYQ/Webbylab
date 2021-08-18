const DB = require('./connect');
const Sequelize = require("sequelize");

module.exports = DB.define("Movie", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    title: {
      type: Sequelize.STRING,
      unique:true,
      allowNull: false
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    format: {
        type: Sequelize.STRING,
        allowNull: false
    },
    actors: {
        type: Sequelize.JSON,
        allowNull: false
    }
  });