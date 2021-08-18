const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const Users = require("./Users");
const crypto = require("crypto");

module.exports = passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(email, password, done) {
    var user = await Users.findOne(
      { where: {
          email: email
        }
      });
    if (user == null) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    if (user.password !== crypto.createHash('md5').update(password).digest('hex')) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  }
  ));
  
  passport.serializeUser(function(user, done) {
    done(null, {id: user.id, email:user.email, name: user.name, token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwiaWF0IjoxNjI1MDUyNDc5fQ.LY8PKLr060GmU81LaW8GY0Ef3Nr0aXHZPhL168rhPa0", createdAt: user.createdAt});
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, {id: user.id, email:user.email, name: user.name, token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwiaWF0IjoxNjI1MDUyNDc5fQ.LY8PKLr060GmU81LaW8GY0Ef3Nr0aXHZPhL168rhPa0", createdAt: user.createdAt});
  });