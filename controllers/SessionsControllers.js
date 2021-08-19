const passport = require("passport");


exports.create_session = (req, res, next)=>{
        passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err); }
          if (!user) { 
              res.json({
                "status": 0,
                "error": {
                  "fields": {
                    "email": "AUTHENTICATION_FAILED",
                    "password": "AUTHENTICATION_FAILED"
                  },
                  "code": "AUTHENTICATION_FAILED"
                }})
          } else {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                res.cookie('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwiaWF0IjoxNjI1MDUyNDc5fQ.LY8PKLr060GmU81LaW8GY0Ef3Nr0aXHZPhL168rhPa0", { httpOnly: true });
                return res.json({
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwiaWF0IjoxNjI1MDUyNDc5fQ.LY8PKLr060GmU81LaW8GY0Ef3Nr0aXHZPhL168rhPa0",
                    "status": 1
                  });
              });
          }
        })(req, res, next);  
}
