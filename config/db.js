const mysql = require('mysql') // เรียกใช้งาน MySQL module
 
const host = ''
const username = ''
const password = ''

// กำหนดการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host     : host,
    user     : username,
    password : password,
    database : ''
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