const Actors = require("./Actors");
const Movies = require("./Movies");
const DB = require('./connect');
const Sequelize = require("sequelize");

const ActorsMovies = DB.define("ActorsMovies", {
    movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    actor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
  });

Actors.belongsToMany(Movies, {through: ActorsMovies, foreignKey:"actor_id", otherKey: 'movie_id'});
Movies.belongsToMany(Actors, {through: ActorsMovies, foreignKey:"movie_id", otherKey: 'actor_id'});

module.exports = ActorsMovies;
