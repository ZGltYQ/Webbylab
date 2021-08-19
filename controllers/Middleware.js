
exports.checkToken = (req, res, next)=>{
    try{
        if(!req.session.passport?.user?.token) throw new Error()
        if(req.headers["postman-token"]){
            if(req.headers.authorization === req.session.passport?.user?.token){
                next()
            } else {
                throw new Error()
            }
        } else {
            if(req.cookies.token === req.session.passport?.user?.token){
                next()
            } else {
                throw new Error()
            }
        }
        
    } catch(err){
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

exports.checkValid = (req, res, next)=>{
    try{
        if(!req.body.title || req.body.title.length <= 0) throw new Error("EMPTY TITLE FIELD");
        if(req.body.year < 1850 || req.body.year > 2021) throw new Error("INVALID YEAR VALUE");
        if(!req.body.actors.length) throw new Error("EMPTY ACTORS FIELD");
        if(req.body.actors.find((actor, index)=>req.body.actors.slice(index + 1).includes(actor))) throw new Error("DUPLICATE ACTORS")
        if(req.body.actors.find(actor=>!/^[a-zA-Z\-,\s]+$/.test(actor))) throw new Error("INVALID ACTOR NAME");
        if(req.body.format !== "VHS" && req.body.format !== "DVD" && req.body.format !== "Blu-Ray") throw new Error("INVALID FORMAT")
        next()
    } catch(err){
        res.json({
            "status": 0,
            "error": `${err}`,
            "code": "MOVIE_EXISTS"
            
          })
    }
    
}