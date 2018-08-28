const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const errorhandler = require('errorhandler')
const session = require('express-session')
const cookieParser = require('cookie-parser')

var app = express()

// passport config
require('./config/passport')(passport)

// load keys
const keys = require('./config/keys')

// mongoose 
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
  })
  .then(() => console.log('connected to database..'))
  .catch(err => console.log(err))

// Load routes
const index = require('./router/index')
const auth = require('./router/auth')

// session middelware
app.use(cookieParser());
app.use(session({
  secret: "sgsfg342h@#4hrh4ANN)*>??@heo",
  resave: false,
  saveUninitialized: false
}))

// passport middelware
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// errorhandler middelware
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler())
}

// use routes
app.use('/', index)
app.use('/auth', auth)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server up at ${port}`)
})