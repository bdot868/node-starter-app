const
  express = require('express'),
  passport = require('passport'),
  userRouter = express.Router(),
  user = require('../models/User.js'),
  usersController = require('../controllers/user.js')

  //login sign up logout and profile view
  userRouter.route('/login')
    .get((req, res) => {res.render('users/login', {message: req.flash('loginMessage')})
    })
    .post(passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login'
    }))

  userRouter.route('/signup')
    .get((req, res) => {res.render('users/signup', {message: req.flash('signupMessage')})
  })
    .post(passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup'
    }))

  userRouter.get('/logout', isLoggedIn, (req, res) => {
    req.logout()
    res.redirect('/')
  })

  userRouter.route('/profile/:id/edit', isLoggedIn)
    .get(usersController.edit)

  userRouter.route('/profile/:id', isLoggedIn)
    .patch(usersController.update)
    .delete(usersController.destroy)

    userRouter.route('/users')
      .get(usersController.users)
      .post(usersController.create)

  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next()
    res.redirect('/')
  }

  module.exports = userRouter
