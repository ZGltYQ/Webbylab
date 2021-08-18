const Users = require("../models/Users");
const crypto = require("crypto");

exports.create = (req, res)=>{
    const {email, name, password, confirmPassword} = req.body;
    if(password === confirmPassword){
        Users.create({
            email,
            name,
            password:crypto.createHash('md5').update(password).digest('hex')
        }).then(result=>{
          res.json({
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyMS0wNi0zMFQxMToyOTo1OC4zNTJaIiwidXBkYXRlZEF0IjoiMjAyMS0wNi0zMFQxMToyOTo1OC4zNTJaIiwiaWF0IjoxNjI1MDUyNTk4fQ.umeB2_FZR28ISofmzsIqshP36k4Lw3aFk7VUZxNXk7U",
            "status": 1
          })
        }).catch(err=>{
            res.json({
                "status": 0,
                "error": {
                  "fields": {
                    "email": "NOT_UNIQUE"
                  },
                  "code": "EMAIL_NOT_UNIQUE"
                }
              })
        })
    }
}