// controllers/authController.js
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      password: hashedPassword
    })
    
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    )
    res.status(201).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    )
    res.json({
      token
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}, 'username') // Adjust the projection as needed
    res.json({ users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
