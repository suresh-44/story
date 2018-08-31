const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Story = mongoose.model('stories')

const {
  isAuthenticated,
  isGuest
} = require('../helper/auth')

router.get('/', isGuest, (req, res) => {
  res.render('index/welcome')
})

router.get('/dashbord', isAuthenticated, (req, res) => {
  Story.find({
      user: req.user.id
    })
    .then(stories => {
      res.render('index/dashbord', {
        stories
      })
    })

})

module.exports = router