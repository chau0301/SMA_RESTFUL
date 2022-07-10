const express = require('express')
require('dotenv').config()
const path = require('path')
const db = require('./config/db.js')
const AuthRoute = require('./src/routes/AuthRoute')
const UserRoute = require('./src/routes/UserRoute')
const PostRoute = require('./src/routes/PostRoute')
const UploadRoute = require('./src/routes/UploadRoute')
const cors = require('cors')

const app = express()
const port = process.env.PORT

//connect DB
db.connect()

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded())
app.use(express.json())
app.use(cors())
//routes
app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/post', PostRoute)
app.use('/api/upload', UploadRoute)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))