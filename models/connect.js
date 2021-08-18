const Sequelize = require("sequelize");

module.exports = new Sequelize("tz", "qwerty", "qwerty03022001", {
  dialect: "mysql",
  host: "tz-db.cqumjjcigocl.us-east-2.rds.amazonaws.com",
  port: "3306"
});

