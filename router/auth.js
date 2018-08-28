const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/dashbord')
})

router.get('/verify', (req, res) => {
  if (req.user) {
    res.send({
      user: req.user
    })
  } else {
    res.send({
      user: 'not found'
    })
  }
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router