const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Story = mongoose.model('stories')

const {
  isAuthenticated,
  isGuest
} = require('../helper/auth')


router.get('/', (req, res) => {
  Story.find({
      status: "public"
    })
    .populate('user')
    .sort({
      date: 'desc'
    })
    .then(stories => {
      res.render('stories/index', {
        stories
      })
    })


})

// Add Story form
router.get('/add', isAuthenticated, (req, res) => {
  res.render('stories/add')
})

// Edit Story Form
router.get('/edit/:id', isAuthenticated, (req, res) => {
  Story.findById(req.params.id)
    .then(story => {
      if (!story) {
        return res.status(400).send()
      }
      if (story.user != req.user.id) {
        return res.redirect('/stories')
      }
      res.render('stories/edit', {
        story
      })
    }).catch(err => res.status(400).send(err))
})

// Update the story// PUT stories/:id 
router.put('/:id', isAuthenticated, (req, res) => {
  let allowComments;
  if (req.body.allowComments) {
    allowComments = true
  } else {
    allowComments: false
  }

  Story.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments
      }
    }, {
      new: true
    })
    .then(story => {
      res.redirect(`/dashbord`)
    })
})


router.post('/', isAuthenticated, (req, res) => {
  let allowComments;
  if (req.body.allowComments) {
    allowComments = true
  } else {
    allowComments = false
  }

  const newStory = {
    title: req.body.title,
    status: req.body.status,
    body: req.body.body,
    user: req.user.id,
    allowComments
  }

  new Story(newStory)
    .save()
    .then(story => {
      res.redirect(`/stories/show/${story._id}`)
    })
    .catch(err => console.log(err))
})

// show single story
router.get('/show/:id', (req, res) => {
  Story.findById(req.params.id)
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      if (story.status === 'public') {
        res.render('stories/show', {
          story
        })
      } else {
        if (req.user) {
          if (req.user.id == story.user._id) {
            res.render('stories/show', {
              story
            })
          } else {
            res.redirect('/stories')
          }
        } else {
          res.redirect('/stories')
        }

      }
    }).catch(err => res.status(400).send(err))
})

router.delete('/:id', (req, res) => {
  Story.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/dashbord')
    })
})

// List Stories from a loggedin user
router.get('/my', isAuthenticated, (req, res) => {
  Story.find({
      user: req.user.id
    })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories
      })
    })
})

// List Stories from a  user
router.get('/user/:userId', (req, res) => {
  Story.find({
      user: req.params.userId,
      status: 'public'
    })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories
      })
    })
})


// Story Comment router
router.post('/comments/:id', (req, res) => {
  Story.findById(req.params.id)
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }
      // Add to comments array
      story.comments.unshift(newComment)

      story.save()
        .then(story => {
          res.redirect(`/stories/show/${story.id}`)
        })
    })
})

module.exports = router