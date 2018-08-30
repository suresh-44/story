const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const exphbs = require('express-handlebars')
const errorhandler = require('errorhandler')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')

var app = express()

// handlebars middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
)
app.set('view engine', 'handlebars')

// passport config
require('./config/passport')(passport)

// load keys
const keys = require('./config/keys')

// mongoose
mongoose
  .connect(
    keys.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log('connected to database..'))
  .catch(err => console.log(err))

// Load routes
const index = require('./router/index')
const auth = require('./router/auth')
const stories = require('./router/stories')

// session middelware
app.use(cookieParser())
app.use(
  session({
    secret: 'sgsfg342h@#4hrh4ANN)*>??@heo',
    resave: false,
    saveUninitialized: false
  })
)

// passport middelware
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = req.user || null
  res.locals.Year = new Date().getFullYear()
  next()
})

// Static public folder
app.use(express.static(path.join(__dirname, 'public')))

// errorhandler middelware
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler())
}

// use routes
app.use('/', index)
app.use('/auth', auth)
app.use('/stories', stories)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server up at ${port}`)
})
