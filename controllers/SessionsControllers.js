const jwt      = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require("passport-jwt");

exports.create_session = (req, res, next)=>{
    passport.authenticate('local', {session: true}, (err, user, info) => {
        // console.log("Users:", user)
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            });
        }

        req.login(user, {session: true}, (err) => {
            if (err) {
                res.send(err);
            }
            
            const token = jwt.sign({id:user.id}, 'zgltyq03022001');
            return res.json({user, token});
        });
    })
    (req, res); 
}
