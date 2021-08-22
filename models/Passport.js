const passport    = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const Users = require("./Users");
const crypto = require("crypto");


passport.use("local", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
      
         Users.findOne({ where: {
                email
              }
            })
            .then(user => {
              if (user == null) {
                return done(null, false, { message: 'Incorrect email.' });
              }
              if (user.password !== crypto.createHash('md5').update(password).digest('hex')) {
                return done(null, false, { message: 'Incorrect password.' });
              }
              return done(null, user);
            })
    }
));

passport.serializeUser(function(user, done) {
  done(null, {id: user.id});
});

passport.deserializeUser(function(user, done) {
  Users.findByPk(user.id).then(des_user=>{
    done(null, des_user);
  })
});

passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromHeader('authorization'),
        secretOrKey   : 'zgltyq03022001'
    },
    function (jwtPayload, cb) {
        //find the user in db if needed
        Users.findByPk(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));