const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userRoutes = require('./routes/user')
const handleConnection = require('./socket/socketHandlers')

const dbUrl = process.env.MONGO_URL
const secretKey = process.env.SECRET_KEY // Change this to a secure secret key

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3002',
    methods: ['POST', 'GET']
  }
})

app.use(express.json())

// Set CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// Connect to MongoDB
mongoose.connect(dbUrl)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

// WebSocket server
// io.use(async (socket, next) => {
//   console.log('inside')
//   try {
//     const token = socket.handshake.auth.token
//     const decoded = jwt.verify(token, secretKey)
//     socket.userId = decoded.userId
//     next()
//   } catch (error) {
//     next(new Error('Authentication error'))
//   }
// })

// Use the separated socket handlers
io.on('connection', (socket) =>handleConnection(socket,io))

// ... (remaining code)

// Routes
app.use('/users', userRoutes)
// app.use('/role', roleRoutes)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
