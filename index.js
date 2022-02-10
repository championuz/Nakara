const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Cors = require('cors')
const morgan = require('morgan')
const path = require('path/posix')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')

// local .env path
const localEnvPath = path.resolve(process.cwd(), '.env.local')

// app config
const app = express()
const port = process.env.PORT || 8000
dotenv.config({path: localEnvPath}) ? dotenv.config() : dotenv.config({path: localEnvPath})

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DB connection successfull!'))
.catch((err) => {
  console.log('An error occcured while connecting with mongoDB')
})
 // process.env.ALLOWED_HOST.slice(1, -1).split(',')
const corsOption = {
  origin: '*',
  optionsSuccessStatus: 200
}

// middleware
app.use(Cors(corsOption))
app.use(express.json())
app.use(morgan('common'))
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)

// root route
app.get('/', (req,res) => res.status(200).json('Welcome to my api'))

// listener
app.listen(port, () => {
  console.log('Backend server is running')
})
