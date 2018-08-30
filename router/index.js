const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index/welcome')
})

router.get('/dashbord', (req, res) => {
  res.render('index/dashbord')
})

module.exports = router