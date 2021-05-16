const router = require("express").Router()
let db = require('../config/db')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const passport = require('passport')

const SECRET = "CS251_Key"

// router.post('/login', (req,res,next)=> {
//     let {citizenID,password,role} = req.body
//     let sql = ' SELECT * FROM ?? WHERE citizenID = ? AND ID = ?'
//     db.query(sql,[role,citizenID,password],(error, results, fields)=>{
//         // console.log("error " + error)
//         if(error) {
//             throw error
//         }   
//         // console.log("result " + results)
//         // console.log(fields)
//         if(results == "") {
//             res.json({
//                 "status" : false,
//                 "msg" : "Invalid username or password!!"
//             })
//             return;
//         }
//         res.json({
//             "status" : true,
//             "msg" : "Login Successfully",
//             "role" : role,
//             "data" : results[0]
//         })
//     })
// })

router.post("/login",(req,res,next) => {
    let role = req.body.role
    passport.authenticate('local',{session : false}, (err,user,info) => {
        if(err) return next(err)
        if(user) {
            const payload = {
                id: user.CitizenID,
                nameTH : user.FnameTH + " " + user.LnameTH,
                nameEH : user.FnameEN + " " + user.LnameEN,
                role : role,
                ClassroomID : user.ClassroomID
            }
            const token = jwt.sign(payload,SECRET)
            return res.json({
                'status' : true,
                'token' : token
            })
        } else {
            return res.status(422).json(info)
        }
    })(req, res, next)
})

router.post('/academic/login', (req,res) => {
    let {username,password} = req.body
    let sql = 'SELECT * FROM academicAdmin WHERE username = ? AND password = ?'
    db.query(sql,[role,citizenID,password],(error, results, fields)=>{
        if(error) {
            throw error
        }   
        if(results == "") {
            res.json({
                "status" : false,
                "msg" : "Invalid username or password!!"
            })
            return;
        }
        res.json({
            "status" : true,
            "msg" : "Login Successfully",
            "role" : "admin",
            "data" : results[0]
        })
    })
})

module.exports = router;
