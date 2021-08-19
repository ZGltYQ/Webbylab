var express = require('express');
var router = express.Router();
var Users = require("../models/Users");
var UserControllers = require("../controllers/UserControllers");
var SessionsControllers = require("../controllers/SessionsControllers");
var MoviesControllers = require("../controllers/MoviesControllers");
var middleware = require("../controllers/Middleware");



router.post("/users", UserControllers.create);
router.post("/sessions", SessionsControllers.create_session);
router.post("/movies", middleware.checkToken, middleware.checkValid, MoviesControllers.add_movie);
router.patch("/movies/:id", middleware.checkToken, middleware.checkValid, MoviesControllers.update_movie);
router.get("/movies/:id", middleware.checkToken, MoviesControllers.show_movie);
router.get("/movies", middleware.checkToken, MoviesControllers.list_movies);
router.post("/movies/import", middleware.checkToken, MoviesControllers.load_file);
router.delete("/movies/:id", middleware.checkToken, MoviesControllers.del_movie);


module.exports = router;