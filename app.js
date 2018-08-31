const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const exphbs = require('express-handlebars')
const errorhandler = require('errorhandler')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')

// Load Models
require('./models/User')
require('./models/Story')

// passport config
require('./config/passport')(passport)

// Load routes
const index = require('./router/index')
const auth = require('./router/auth')
const stories = require('./router/stories')

// Handelbars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helper/hbs')

var app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// method-override middleware
app.use(methodOverride('_method'))

// handlebars middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      truncate,
      stripTags,
      formatDate,
      select,
      editIcon
    },
    defaultLayout: 'main'
  })
)
app.set('view engine', 'handlebars')


// load keys
const keys = require('./config/keys')


// mongoose
mongoose
  .connect(
    keys.mongoURI, {
      useNewUrlParser: true
    }
  )
  .then(() => console.log('connected to database..'))
  .catch(err => console.log(err))


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