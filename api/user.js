const router = require("express").Router()
const { query } = require("../config/db");
let db = require('../config/db')

router.get("/student/get/profile",(req,res) => {
    let {CitizenID} = req.query
    let sql = ' SELECT * FROM Student WHERE CitizenID = ?'
    let results = []
    db.query(sql,[CitizenID],(error, result, fields)=>{
        if(error) {
            throw error
        }   
        if(result == "") {
            res.json({
                "status" : false,
            })
            return;
        }
        results.push({
            "profile" : result[0]
        })
    })
    sql = ' SELECT Nickname,Fname,Lname,phone,relation FROM Dependent WHERE S_CitizenID = ?'
    db.query(sql,[CitizenID],(error, result, fields)=>{
        if(error) {
            throw error
        }   
        if(result == "") {
            res.json({
                "status" : false,
            })
            return;
        }
        results.push({
            "dependent" : result[0]
        })
    })
    sql = ' SELECT Ability FROM SpecialAbility WHERE S_CitizenID = ?'
    db.query(sql,[CitizenID],(error, result, fields)=>{
        if(error) {
            throw error
        }   
        if(results != "") {
            results.push({
                "Ability" : result
            })
        }
        res.json({
            "status" : true,
            "data" : results
        })
    })
});

router.get('/student/get/advisor', (req,res) => {
    let sql = ' SELECT citizenID,fullnameTH,fullnameEN FROM advisor WHERE ClassroomID = ?'
    let {ClassroomID} = req.query
    db.query(sql,[ClassroomID],(error, result, fields)=>{
        if(error) {
            throw error
        }   
        if(result == "") {
            res.json({
                "status" : false,
            })
            return;
        }
        res.json({
            "status" : true,
            "data" : result
        })
    })
})

router.get("/student/get/subject", (req,res) => {
    let {ClassroomID,Term} = req.query
    console.log(ClassroomID)
    // let sql = 'SELECT * FROM Student_Room_log JOIN Class_Subject_list ON Student_Room_log.ClassroomID = Class_Subject_list.ClassroomID JOIN Assignments ON Class_Subject_list.S_ID = Assignments.S_ID AND Student_Room_log.StudentCitizenID = Assignments.Student_CitizenID WHERE Student_Room_log.StudentCitizenID = ? AND Student_Room_log.ClassroomID = ?'
    // let sql = 'SELECT S_ID,S_name FROM Student_Room_log JOIN Class_Subject_list ON Student_Room_log.ClassroomID = Class_Subject_list.ClassroomID WHERE Student_Room_log.StudentCitizenID = ? AND Student_Room_log.ClassroomID = ? AND Class_Subject_list.Term = ?'
    let sql = 'SELECT * FROM Class_Subject_list WHERE ClassroomID = ? AND Term = ?'
    db.query(sql,[ClassroomID,Term],(error, results) => {
        if(error) {
            throw error
        }   
        if(results == "") {
            res.json({
                "status" : false,
            })
            return;
        }
        console.log(results)
        res.json({
            "status" : true,
            "data" : results
        })
    })
})

router.get("/student/get/assignments", (req,res) => {
    let {CitizenID,S_ID} = req.query
    console.log(CitizenID + " " +S_ID);
    let sql = ' SELECT AssignName,ReceiveScore,FullScore FROM AssignmentList JOIN Assignments ON AssignmentList.S_ID = Assignments.S_ID AND AssignmentList.AssignNo = Assignments.AssignNo WHERE Student_CitizenID = ? AND AssignmentList.S_ID = ?'
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

router.get( '/student/get/historyRoom',(req,res) => {
    let CitizenID = req.query.CitizenID
    let sql = 'SELECT * FROM Student_Room_log JOIN Classroom ON Student_Room_log.ClassroomID = Classroom.ClassroomID WHERE StudentCitizenID = ?'
    db.query(sql,CitizenID,(error,result) => {
        if(error) throw error
        res.json(result)
    })
})

router.get('/student/get/gpaTable', (req,res) => {
    let {CitizenID,ClassroomID,Term} = req.query
    let sql = 'SELECT SubjectID,SubjectName,Type,Dredit,SchoolRecord.Score,SchoolRecord.Grade FROM Class_Subject_list JOIN Subject ON Class_Subject_list.S_ID = Subject.ID JOIN SchoolRecord ON Subject.ID = SchoolRecord.S_ID WHERE CitizenID = ? AND ClassroomID = ? AND Class_Subject_list.Term = ?'
    db.query(sql, [CitizenID,ClassroomID,Term], (error,result) => {
        if(error) throw error
        res.json(result)
    })
})

router.get('/teacher/get/all',(req,res) => {
    let sql = 'SELECT FnameTH,LnameTH,phone,email FROM Staff WHERE Type = ?'
    db.query(sql,'Teacher', (error,result) => {
        if(error) throw error
        res.json(result)
    })
})

router.get('/teacher/get/byDepartment',(req,res) => {
    let departID = req.query.DepartID
    let sql = 'SELECT FnameTH,LnameTH,phone,email,Department.Type,Department_list.departmen_name FROM Staff JOIN Department ON Staff.CitizenID = Department.CitizenID JOIN Department_list ON Department.DepartID = Department_list.department_id WHERE Department.DepartID = ?'
    db.query(sql,departID, (error,result) => {
        if(error) throw error
        res.json(result)
    })
})

router.get('/teacher/get/search',(req,res) => {
    let keyword = req.query.keyword
    keyword = '%' + keyword + '%'
    let sql = "SELECT FnameTH,LnameTH,phone,email,Department_list.departmen_name,Staff.CitizenID FROM Staff JOIN Department ON Staff.CitizenID = Department.CitizenID JOIN Department_list ON Department.DepartID = Department_list.department_id WHERE FnameTH LIKE ? OR LnameTH LIKE ? OR FnameEN LIKE ? OR LnameEN LIKE ?"
    db.query(sql,[keyword,keyword,keyword,keyword], (error,result) => {
        if(error) throw error
        res.json(result)
    })
})

router.get('/teacher/get/byCitizenID',(req,res) => {
    let CitizenID = req.query['CitizenID']
    let sql = "SELECT * FROM Staff JOIN Department ON Staff.CitizenID = Department.CitizenID JOIN Department_list ON Department.DepartID = Department_list.department_id WHERE Staff.CitizenID = ? "
    console.log(CitizenID)
    db.query(sql,[CitizenID], (error,result) => {
        if(error) throw error
        res.json(result)
    })
})

router.get('/department/get/all',(req,res) => {
    let sql = 'SELECT * FROM Department_list'
    db.query(sql, (error,result) => {
        if(error) throw error
        res.json(result)
    })
})

router.put('/state/open', (req,res) => {
    let {Name} = req.body
    let sql = 'UPDATE State SET Status = ? WHERE Name = ?'
    db.query(sql,['true',name], (error,result) => {
        if (error) throw error
        res.json({
            "status" : true,
            "msg" : "Successfully"
        })
    })
})

router.put('/state/close', (req,res) => {
    let {Name} = req.body
    let sql = 'UPDATE State SET Status = ? WHERE Name = ?'
    db.query(sql,['false',name], (error,result) => {
        if (error) throw error
        res.json({
            "status" : true,
            "msg" : "Successfully"
        })
    })
})

router.post('/poll/vote',(req,res) => {
    let {T_CitizenID,CitizenID} = req.body
    let sql = 'INSERT INTO Review_log (S_CitizenID,T_CitizenID) VALUES (?,?)'
    db.query(sql,[CitizenID,T_CitizenID], (error,result) => {
        if(error) throw error 
    }) 
    sql = 'SELECT * FROM Review WHERE T_CitizenID = ?'
    db.query(sql,[T_CitizenID], (error,result) => {
        if(error) throw error
        if(result == "") {
            sql = 'INSERT INTO Review (T_CitizenID,VoteScore) VALUES (?,1)'
            db.query(sql,[T_CitizenID], (error,result) => {
                if(error) throw error
                res.json({
                    "status" : true,
                    "msg" : "Successfully"
                })
            })
        } else {
            sql = 'UPDATE Review SET VoteScore = ? WHERE T_CitizenID = ?'
            db.query(sql,[result[0].VoteScore + 1,T_CitizenID], (error,result) => {
                if(error) throw error
                res.json({
                    "status" : true,
                    "msg" : "Successfully"
                })
            })
        }
    })
})

router.get('/poll/get/permission', (req,res) => {
    let CitizenID = req.query.CitizenID
    let sql = 'SELECT * FROM State WHERE Name = ?'
    db.query(sql,['poll'], (error,result) => {
        if(error) throw error
        if(result[0].Status == 'true') {
            sql = 'SELECT * FROM Review_log WHERE S_CitizenID = ?'
            db.query(sql,[CitizenID], (error,result) => {
                if(error) throw error
                if(result == "") {
                    res.json({
                        "status" : true,
                        "msg" : "You have the right to vote"
                    })
                } else {
                    res.json({
                        "status" : false,
                        "msg" : "Voted"
                    })
                }
            })
        }
    })
})

router.get('/poll/get/vote', (req,res) => {
    let CitizenID = req.query.CitizenID
    let sql = 'SELECT T_CitizenID FROM Review_log WHERE S_CitizenID = ?'
    db.query(sql,CitizenID, (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "data" : result[0]
        })
    })
})

router.get('/teacher/get/subject', (req,res)=> {
    let {CitizenID,Term,Year} = req.query
    let sql = 'SELECT * FROM Subject JOIN Class_Subject_list ON Subject.ID = Class_Subject_list.S_ID JOIN Classroom ON Class_Subject_list.ClassroomID = Classroom.ClassroomID WHERE TeacherCitizenID = ? AND Subject.Term = ? AND Subject.Year = ?'
    db.query(sql,[CitizenID,Term,Year], (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "data" : result
        })
    })
})

router.get('/teacher/get/subject/assignment', (req,res) => {
    let {ClassroomID,S_ID} = req.body
    let sql = 'SELECT AssignNo,AssignName,FullScore FROM AssignmentList WHERE S_ID = ? AND ClassroomID = ?'
    db.query(sql,[S_ID,ClassroomID], (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "data" : result
        })
    })
})

router.get('/teacher/add/subject/assignment', (req,res) => {
    let {AssignNo,S_ID,AssignName,FullScore,ClassroomID} = req.body
    let sql = 'INSERT INTO AssignmentList (AssignNo,S_ID,AssignName,FullScore,ClassroomID) VALUES (?,?,?,?,?)'
    db.query(sql,[AssignNo,S_ID,AssignName,FullScore,ClassroomID], (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
        })
    })
    // sql = 'INSERT INTO AssignmentList (S_ID,AssignNo,Student_CItizenID,ReceiveScore,ClassroomID) VALUES (?,?,?,?,?)'
    // db.query(sql,)
})

// router.get('/teacher/get/subject/student/list', (req,res) => {
//     let {}
// })

router.get('/get/student/byClassroom', (req,res) => {
    let {ClassroomID} = req.query
    let sql = 'SELECT ID,FnameTH,LnameTH,CitizenID FROM Student WHERE ClassroomID = ?'
    db.query(sql,[ClassroomID], (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "data" : result
        })
    })
})

router.put('/teacher/edit/subject/assignment/student', (req,res) => {
    let {S_ID,AssignNo,Student_CItizenID,ReceiveScore,ClassroomID} = req.body
    let sql = 'SELECT * FROM Assignments WHERE S_ID = ? AND AssignNo = ? AND Student_CItizenID = ?'
    db.query(sql, [S_ID,AssignNo,Student_CItizenID,ReceiveScore,ClassroomID], (error,result) => {
        if(error) throw error
        if(result == "") {
            sql = 'INSERT INTO Assignments (S_ID,AssignNo,Student_CItizenID,ReceiveScore,ClassroomID) VALUES (?,?,?,?,?)'
            db.query(sql,[S_ID,AssignNo,Student_CItizenID,ReceiveScore,ClassroomID], (error,result) => {
                if(error) throw error
                res.json({
                    "status" : true,
                    "msg" : "Added successfully"
                })
            })
        } else {
            sql = 'UPDATE  Assignments SET ReceiveScore = ? WHERE S_ID = ? AND AssignNo = ? AND Student_CItizenID = ?'
            db.query(sql,[ReceiveScore,S_ID,AssignNo,Student_CItizenID], (error,result) => {
                if(error) throw error
                res.json({
                    "status" : true,
                    "msg" : "Update successfully"
                })
            })
        }
    })
})

router.get('/subject/getAll',(req,res) => {
    let sql = 'SELECT * FROM Subject'
    db.query(sql, (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "data" : result
        })
    })
})

router.put('/subject/edit',(req,res) => {
    let {ID,SubjectID,DepartID,SubjectName,Type,Score,Dredit,TeacherCitizenID,TeacherName,Term,Year,level} = req.body
    let sql = 'UPDATE  Subject SET SubjectID = ?, DepartID = ?, SubjectName = ?, Type = ?, Score = ?, Dredit = ?, TeacherCitizenID = ?, TeacherName = ?, Term = ?, Year = ?, level = ? WHERE ID = ?'
    
    db.query(sql,[SubjectID,DepartID,SubjectName,Type,Score,Dredit,TeacherCitizenID,TeacherName,Term,Year,level,ID], (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "msg" : "Update successfully"
        })
    })
})

router.delete('/subject/delete',(req,res) => {
    let {ID} = req.body
    let sql = 'DELETE FROM  Subject WHERE ID = ?'
    
    db.query(sql,[ID], (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "msg" : "Delete successfully"
        })
    })
})

router.post('/subject/add', (req,res) => {
    let {SubjectID,DepartID,SubjectName,Type,Score,Dredit,TeacherCitizenID,TeacherName,Term,Year,level} = req.body
    let sql = 'INSERT INTO Subject (SubjectID,DepartID,SubjectName,Type,Score,Dredit,TeacherCitizenID,TeacherName,Term,Year,level) VALUES (?,?,?,?,?,?,?,?,?,?,?)'

    db.query(sql,[SubjectID,DepartID,SubjectName,Type,Score,Dredit,TeacherCitizenID,TeacherName,Term,Year,level], (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "msg" : "added successfully"
        })
    })
})

router.get('/level/getAll',(req,res) => {
    let sql = 'SELECT idLevel,FnameTH,LnameTH,FnameEN,LnameEN FROM Level JOIN Staff ON Level.CitizenID = Staff.CitizenID'
    db.query(sql, (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "data" : result
        })
    })
})

router.get('/level/classroom/getByLevel', (req,res) => {
    let {level} = req.body
    let sql = 'SELECT * FROM Classroom JOIN advisor ON Classroom.ClassroomID = advisor.ClassroomID WHERE Classroom.Level= ?'
    db.query(sql,level, (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "data" : result
        })
    })
})

router.put('/classroom/edit',(req,res) => {
    let {ClassroomID,plan,citizenID,fullnameTH,fullnameEN} = req.body
    let sql = 'UPDATE  Classroom SET Plan = ? WHERE ClassroomID = ?'
    let sql2 = 'UPDATE  advisor SET citizenID = ?, fullnameTH = ?, fullnameEN = ? WHERE ClassroomID = ?'
    db.query(sql,[plan,ClassroomID], (error,result) => {
        if(error) throw error

        db.query(sql2,[citizenID,fullnameTH,fullnameEN,ClassroomID],(error,result)=> {
            if(error) throw error
            res.json({
                "status" : true,
                "msg" : "Update successfully"
            })
        })
        
    })
})

router.post('/student/add', (req,res)=> {
    let {CitizenID,ClassroomID,Nickname,FnameTH,LnameTH,FnameEN,LnameEN,Location,zip,Bdate,email,phone} = req.body
    let sql = 'INSERT INTO Student (CitizenID,ClassroomID,Nickname,FnameTH,LnameTH,FnameEN,LnameEN,Location,zip,Bdate,email,phone) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
    db.query(sql,[CitizenID,ClassroomID,Nickname,FnameTH,LnameTH,FnameEN,LnameEN,Location,zip,Bdate,email,phone], (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "msg" : "added successfully"
        })
    })
})

router.delete('/student/delete',(req,res)=> {
    let {ID} = req.body
    let sql = 'DELETE FROM Student WHERE ID = ?'
    db.query(sql,ID,(error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "msg" : "delete successfully"
        })
    })
})

router.put('/staff/edit',(req,res) => {
    let {ID,CitizenID,Nickname,FnameTH,LnameTH,FnameEN,LnameEN,Type,Sub_Type,Location,zip,Bdate,Email,Phone} = req.body
    let sql = 'UPDATE Staff SET CitizenID = ?, Nickname = ?, FnameTH = ?, LnameTH = ?, FnameEN = ?, LnameEN = ?, Type = ?, Sub_Type = ?, Location = ?, zip = ?, Bdate = ?, Email = ?, Phone = ? WHERE ID = ?' 
    db.query(sql,[CitizenID,Nickname,FnameTH,LnameTH,FnameEN,LnameEN,Type,Sub_Type,Location,zip,Bdate,Email,Phone,ID], (error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "msg" : "Update successfully"
        })
    })
})

router.put('/teacher/delete',(req,res)=> {
    let {ID} = req.query
    let sql = 'DELETE FROM Staff WHERE ID = ?'
    db.query(sql,ID,(error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "msg" : "delete successfully"
        })
    })
})

router.get('/student/classroom',(req,res) => {
    let {ClassroomID} = req.query
    console.log(ClassroomID)
    let sql = 'SELECT * FROM Classroom WHERE ClassroomID = ?'
    db.query(sql,ClassroomID,(error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "data" : result
        })
    })
})

router.get('/teacher/getAdvisor',(req,res) => {
    let {CitizenID} = req.query
    console.log(CitizenID)
    let sql = 'SELECT * FROM advisor JOIN Classroom ON advisor.ClassroomID = Classroom.ClassroomID WHERE advisor.CitizenID = ?'
    db.query(sql,CitizenID,(error,result) => {
        if(error) throw error
        res.json({
            "status" : true,
            "data" : result
        })
    })
})

module.exports = router;