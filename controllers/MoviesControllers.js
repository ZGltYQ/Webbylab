const Actors = require("../models/Actors");
const Movies = require("../models/Movies");
const {ActorsMovies} = require("../models/ActorsMovies");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const fs = require("fs")

exports.load_file = (req, res, next)=>{
    if(req.session.passport.user.token){
    fs.readFile("uploads/"+req.file.originalname, "utf8", 
            function(error,data){
                if(error) throw error; // если возникла ошибка
                let parse = data.split("\n").filter(row=>row.length>0);
                let result = []
                for (index=0; index < parse.length/4; index+=4){
                    result.push(
                        {
                            title:parse[index].split(": ")[1],
                            year:parse[index + 1].split(": ")[1],
                            format:parse[index + 2].split(": ")[1],
                            actors:[
                                ...parse[index + 3].split(": ")[1].split(", ")
                            ]
                        }
                    )
                }

                result.forEach(item=>{
                    Movies.create(item).then(movie=>{
                        console.log(movie)
                        let actor_list = [];
                        item.actors.map(actor=>{
                            actor_list.push({name:actor})
                        })
                         Actors.bulkCreate(actor_list).then(actors=>{
                             actors.forEach(actor => {
                                 movie.addActors(actor, {through:{movie_id:movie.dataValues.id, actor_id: actor.dataValues.id}})
                             });
                         });
                    })
                })
                  
                res.json(result)
                   
                // res.render('index', {list:parse})
        });
    } else {
        res.json({
            "status": 0,
            "error": {
              "fields": {
                "token": "REQUIRED"
              },
              "code": "FORMAT_ERROR"
            }
          })
    }  
    }

exports.add_movie = (req,res)=>{
    if(req.session.passport.user.token){
   Movies.create(req.body).then(movie=>{
        let actor_list = [];
        req.body.actors.map(actor=>{
            actor_list.push({name:actor})
        })
        Actors.bulkCreate(actor_list).then(actors=>{
            actors.forEach(actor => {
                movie.addActors(actor, {through:{movie_id:movie.dataValues.id, actor_id: actor.dataValues.id}})
            });

            res.json({
                "data": {
                  "id": movie.dataValues.id,
                  "title": movie.dataValues.title,
                  "year": movie.dataValues.year,
                  "format": movie.dataValues.format,
                  "actors": [
                    actors
                  ],
                  "createdAt": movie.dataValues.createdAt,
                  "updatedAt": movie.dataValues.updatedAt
                },
                "status": 1
              })
        });
   }).catch(()=>{
       res.json({
        "status": 0,
        "error": {
          "fields": {
            "title": "NOT_UNIQUE"
          },
          "code": "MOVIE_EXISTS"
        }
      })
   });
} else {
    res.json({
        "status": 0,
        "error": {
          "fields": {
            "token": "REQUIRED"
          },
          "code": "FORMAT_ERROR"
        }
      })
}
}

exports.del_movie = (req, res)=>{
    if(req.session.passport.user.token){
    Movies.findOne({where: {id: req.params.id}})
    .then(movie=>{
        if(!movie) res.json({
            "status": 0,
            "error": {
              "fields": {
                "id": 4
              },
              "code": "MOVIE_NOT_FOUND"
            }
          });

        movie.getActors().then(actors=>{
            
            for(actor of actors){
                actor.destroy();
            }
            movie.destroy().then(()=>{
                res.json({
                    "status": 1
                  })
            });  
    });
});
} else {
    res.json({
        "status": 0,
        "error": {
          "fields": {
            "token": "REQUIRED"
          },
          "code": "FORMAT_ERROR"
        }
      })
}
}

exports.update_movie = (req,res)=>{
    if(req.session.passport.user.token){
        
        Movies.update(req.body,{where:{
            id:req.params.id
        }}).then(()=>{
            Movies.findOne({where:{
                id:req.params.id
            }}).then((movie)=>{
                if(!movie){
                    res.json({
                        "status": 0,
                        "error": {
                          "fields": {
                            "id": 110
                          },
                          "code": "MOVIE_NOT_FOUND"
                        }
                      })
                } else {

                movie.getActors().then(actors=>{
                    actors.forEach((actor, i)=>{
                        actor.update({name:req.body.actors[i]})
                    }) 
                });

                res.json(
                    {
                        "data": {
                          "id": movie.dataValues.id,
                          "title": movie.dataValues.title,
                          "year": movie.dataValues.year,
                          "format": movie.dataValues.format,
                          "actors": [
                            movie.dataValues.actors
                          ],
                          "createdAt": movie.dataValues.createdAt,
                          "updatedAt": movie.dataValues.updatedAt
                        },
                        "status": 1
                      }
                )
                }
            })
            
        })

    } else {
        res.json({
            "status": 0,
            "error": {
              "fields": {
                "token": "REQUIRED"
              },
              "code": "FORMAT_ERROR"
            }
          })
    }
};

exports.show_movie = (req, res)=>{
    if(req.session.passport.user.token){
    Movies.findOne({where:{
        id:req.params.id
    }}).then(movie=>{
        if(!movie) {
            res.json({
                "status": 0,
                "error": {
                  "fields": {
                    "id": 12334
                  },
                  "code": "MOVIE_NOT_FOUND"
                }
              })
        } else {
            res.json(
                {
                    "data": {
                      "id": movie.dataValues.id,
                      "title": movie.dataValues.title,
                      "year": movie.dataValues.year,
                      "format": movie.dataValues.format,
                      "actors": [
                        movie.dataValues.actors
                      ],
                      "createdAt": movie.dataValues.createdAt,
                      "updatedAt": movie.dataValues.updatedAt
                    },
                    "status": 1
                  }
            )
        }
    })
} else {
    res.json({
        "status": 0,
        "error": {
          "fields": {
            "token": "REQUIRED"
          },
          "code": "FORMAT_ERROR"
        }
      })
}
}

exports.list_movies = (req, res)=>{
    if(req.session.passport.user.token){

        let params = {
            where: {

            },
            attributes: ['id', 'title', 'year', 'format', 'actors', "createdAt", "updatedAt"]
        }
        
        for(value in req.query){
            value === "title" || value === "search" || value === "actor" ?
             params.where[value] = {[Op.substring]:req.query[value]} : null;
            value === "order" ? params[value] = [[req.query?.sort, req.query?.order]] : null;
            value === "offset" || value === "limit" ? params[value] = +req.query[value] : null
        }
        
        if(params.where.actor){
            Movies.findAndCountAll({
                where:{
                    actors:params.where.actor
                },
                raw: true
            }).then(movies=>{
                res.json(
                    {
                        "data": [
                          ...movies.rows
                        ],
                        "meta": {
                          "total": movies.count
                        },
                        "status": 1
                      }
                )
            })
        } else if (params.where.search){
            Movies.findAndCountAll({
                where:{
                    [Op.or]:[{actors:params.where.search},{title:params.where.search}]
                },
                raw: true
            }).then(movies=>{
                res.json(
                    {
                        "data": [
                          ...movies.rows
                        ],
                        "meta": {
                          "total": movies.count
                        },
                        "status": 1
                      }
                )
            })
        } else {
            Movies.findAll(params).then(list => {
                res.json(list)
              }).catch(err=>{
                  res.json(
                    {
                        "status": 0,
                        "error": {
                          "code": "You have an error in your SQL syntax"
                        }
                      }
                  )
              });
        }
        
    } else {
        res.json({
            "status": 0,
            "error": {
              "fields": {
                "token": "REQUIRED"
              },
              "code": "FORMAT_ERROR"
            }
          })
    }
}