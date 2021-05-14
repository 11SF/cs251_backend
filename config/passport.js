const passport      = require('passport'),
      passportJWT   = require("passport-jwt"),
      ExtractJWT    = passportJWT.ExtractJwt,
      JWTStrategy   = passportJWT.Strategy,
      LocalStrategy = require('passport-local').Strategy,
      bcrypt        = require('bcrypt'),
      db            = require('../config/db')

passport.use(new LocalStrategy (
    {passReqToCallback: true},
    (req,username,password,cb) => {
        let role = req.body.role
        let sql = ' SELECT * FROM ?? WHERE citizenID = ?'
        db.query(sql,[role,username],(error, results, fields)=>{
            if(error) {
                throw error
            }   
            if(results == "") {
                return cb(null, false, {
                    "msg" : "Invalid username or password!!"
                })
            }
            // const isCorrect = bcrypt.compareSync(password, results[0].ID);
            if(password == results[0].ID) {
                return cb(null, results[0], {
                    "msg" : "Login Successfully",
                })
            } else {
                return cb(null, false, {
                    "status" : false,
                    "msg" : "Invalid username or password!!"
                })
            }
        })
    }
))

const SECRET = ""

passport.use(new JWTStrategy(
    {
        jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey    : SECRET
    },
    (payload,cb) => {
        console.log(payload)
        if(payload) {
            cb(null,true)
        } else {
            cb(err,false)
        }
    }
))