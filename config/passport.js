const
  dotenv = require('dotenv').load({silent: true}),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../models/User.js')

  //Generate a cookie string (encoded string out of users ID)
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  //Decode an incoming cookie (translate it back into a user object)
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({'local.email': email}, (err, user) => {
      if(err) return done(err)
      if(user) return done(null, false, req.flash('signupMessage', 'Email is already in use. Please sign in or use another email.'))

      var newUser = new User()
      newUser.local.firstname = req.body.firstname
      newUser.local.lastname = req.body.lastname
      newUser.local.email = req.body.email
      newUser.local.password = newUser.generateHash(req.body.password)
      newUser.save((err, newlyCreatedUser) => {
        if(err) return console.log(err)
        return done(null, newlyCreatedUser, null)
      })
    })
  }))

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({'local.email': email}, (err, user) => {
      if (err) return done(err)
      if (!user) return done(null, false, req.flash('loginMessage', 'The email and password combination you entered could not be found. Please try again.'))
      if (!user.validPassword(password)) return done(null, false, req.flash ('loginMessage'))

      return done(null, user)
    })
  }))

  module.exports = passport
