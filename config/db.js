const mysql = require('mysql') // เรียกใช้งาน MySQL module
 
const host = '35.187.239.83'
const username = 'cs-251-database'
const password = 'cs251admin'

// กำหนดการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host     : host,
    user     : username,
    password : password,
    database : 'cs251'
  })
 
// ทำการเชื่อมต่อกับฐานข้อมูล 
db.connect((err) =>{
    if(err){ // กรณีเกิด error
        console.error('error connecting: ' + err.stack)
        return
    }
    console.log('connected as id ' + db.threadId)
})
// ปิดการเชื่อมต่อฐานข้อมูล MySQL ในที่นี้เราจะไม่ให้ทำงาน
// db.end() 
module.exports = db