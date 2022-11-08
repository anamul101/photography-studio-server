const express = require('express')
const app = express()
const cors= require('cors')
const port = process.env.PORT || 5000;
// const jwt = require('jsonwebtoken');
require('dotenv').config()

// middelware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Photography server is running!')
})

app.listen(port, () => {
  console.log(`Assignment 11 photography server site ${port}`)
})