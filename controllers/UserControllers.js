const Users = require("../models/Users");
const crypto = require("crypto");


exports.create = (req, res)=>{
    const {email, name, password, confirmPassword} = req.body;
    if(password === confirmPassword && email.length > 0 && email.indexOf("@") !== -1){
        Users.create({
            email,
            name,
            password:crypto.createHash('md5').update(password).digest('hex')
        }).then(user=>{
          res.json({
            "token": "create session for token",
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