let express = require('express')
let cors = require('cors')
let router = express.Router()
let bodyParser = require('body-parser')
let https = require('https')
const { Router } = require('express')
let passport = require('passport')

let app = express()

require('./config/db')
require('./config/passport')

const HOST = '0.0.0.0'
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api',require('./api/login'))
app.use('/api/user',passport.authenticate('jwt', {session: false}),require('./api/user'))

app.listen(PORT, HOST, () => {
    console.log("Server is running on port :", PORT)
})