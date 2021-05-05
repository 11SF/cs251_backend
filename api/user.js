const router = require("express").Router()
const { query } = require("../config/db");
let db = require('../config/db')

router.get("/student/get/profile", (req, res,next) => {
    let CitizenID = req.body.CitizenID
    let sql = ' SELECT * FROM Student WHERE CitizenID = ?'
    let result = []

    db.query(sql,[CitizenID],(error, results, fields)=>{
        if(error) {
            throw error
        }   
        if(results == "") {
            res.json({
                "status" : false,
            })
            return;
        }
        result.push({
            "profile" : results[0]
        })
    })
    sql = ' SELECT Nickname,Fname,Lname,phone FROM Dependent WHERE S_CitizenID = ?'
    db.query(sql,[CitizenID],(error, results, fields)=>{
        if(error) {
            throw error
        }   
        if(results == "") {
            res.json({
                "status" : false,
            })
            return;
        }
        result.push({
            "dependent" : results[0]
        })
    })
    sql = ' SELECT Ability FROM SpecialAbility WHERE S_CitizenID = ?'
    db.query(sql,[CitizenID],(error, results, fields)=>{
        if(error) {
            throw error
        }   
        if(results != "") {
            result.push({
                "Ability" : results
            })
        }
        res.json({
            "status" : true,
            "data" : result
        })
    })
});

router.get("/student/get/subject", (req,res) => {
    let {level,room} = req.body
    let sql = ' SELECT S_ID,S_name FROM Class_Subject_list WHERE level = ? AND room = ?'
    db.query(sql,[level,room],(error, results, fields) => {
        if(error) {
            throw error
        }   
        if(results == "") {
            res.json({
                "status" : false,
            })
            return;
        }
        res.json({
            "status" : true,
            "data" : results
        })
    })
})

router.get("/student/get/assignments", (req,res) => {
    let {CitizenID,S_ID} = req.body
    let sql = ' SELECT AssignName,ReceiveScore,FullScore FROM Assignments WHERE Student_CitizenID = ? AND S_ID = ?'
    db.query(sql,[CitizenID,S_ID],(error, results, fields) => {
        if(error) {
            throw error
        }   
        if(results == "") {
            res.json({
                "status" : false,
            })
            return;
        }
        res.json({
            "status" : true,
            "data" : results
        })
    })
})
// router.post('/student/add', (req,res) => {
//     let payload = req.body
//     let sql = 'INSERT INTO Student (`CitizenID`, `Level`, `Room`, `Nickname`, `FnameTH`, `LnameTH`, `FnameEN`, `LnameEN`, `Location`, `zip`, `Bdata`, `email`) VALUES ?'
//     db.query(sql, payload, (error, results, fields)=>{
//         console.log(error)
//         if(error) {
//             throw error
//         }   
//         console.log(results.insertId)
//         console.log(results)
//         console.log(fields)
//         res.json(results)
//     })
// })



module.exports = router;