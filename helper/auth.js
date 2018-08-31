module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  },
  isGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect('/dashbord')
    } else {
      return next()
    }

  }
}