var express = require('express');
var router = express.Router();
var Users = require("../models/Users");
var UserControllers = require("../controllers/UserControllers");
var SessionsControllers = require("../controllers/SessionsControllers");
var MoviesControllers = require("../controllers/MoviesControllers");

router.post("/users", UserControllers.create);
router.post("/sessions", SessionsControllers.create_session);
router.post("/movies", MoviesControllers.add_movie);
router.patch("/movies/:id", MoviesControllers.update_movie);
router.get("/movies/:id", MoviesControllers.show_movie);
router.get("/movies", MoviesControllers.list_movies);
router.post("/movies/import", MoviesControllers.load_file);
router.delete("/movies/:id", MoviesControllers.del_movie);


module.exports = router;