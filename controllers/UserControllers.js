const Users = require("../models/Users");
const crypto = require("crypto");

exports.create = (req, res)=>{
    const {email, name, password, confirmPassword} = req.body;
    if(password === confirmPassword && email.length > 0 && email.indexOf("@") !== -1){
        Users.create({
            email,
            name,
            password:crypto.createHash('md5').update(password).digest('hex')
        }).then(result=>{
          res.json({
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwiaWF0IjoxNjI1MDUyNDc5fQ.LY8PKLr060GmU81LaW8GY0Ef3Nr0aXHZPhL168rhPa0",
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
    } else {
      res.json({
        "status": 0,
        "error": {
          "fields": {
            "email": "email must be longer than one character and have '@'"
          },
          "code": "INVALID_EMAIL"
        }
      })
    }
}