var express = require('express');
var router = express.Router();
var UserControllers = require("../controllers/UserControllers");
var SessionsControllers = require("../controllers/SessionsControllers");
var MoviesControllers = require("../controllers/MoviesControllers");
var middleware = require("../controllers/Middleware");
var passport = require("passport");

router.post("/users", UserControllers.create);
router.post("/sessions", SessionsControllers.create_session);
router.post("/movies", passport.authenticate('jwt', { session: true }), middleware.checkValid, MoviesControllers.add_movie);
router.patch("/movies/:id", passport.authenticate('jwt', { session: true }), middleware.checkValid, MoviesControllers.update_movie);
router.get("/movies/:id", passport.authenticate('jwt', { session: true }), MoviesControllers.show_movie);
router.get("/movies", passport.authenticate('jwt', { session: true }), MoviesControllers.list_movies);
router.post("/movies/import", passport.authenticate('jwt', { session: true }), MoviesControllers.load_file);
router.delete("/movies/:id", passport.authenticate('jwt', { session: true }), MoviesControllers.del_movie);


module.exports = router;