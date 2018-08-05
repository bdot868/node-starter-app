const
  mongoose = require('mongoose'),
  validate = require('mongoose-validator'),
  bcrypt = require('bcrypt-nodejs'),
  nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 10],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Name should contain alpha-numeric characters only'
  })
],
emailValidator = [
  validate({
    validator: 'isLength',
    arguments: [5, 20],
    message: "Email Address should be between 5 and 20 characters"}),
  validate({
    validator: 'isEmail',
    message: "Email Address is not correct"}
  )],
  userSchema = new mongoose.Schema({
    local: {
      firstname: {type: String, required: true, validate: nameValidator},
      lastname: {type: String, required: true, validate: nameValidator},
      email: {type: String, required: true, validate: emailValidator},
      password: {type: String, required: true},
    }
  })

  userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password)
  }

  module.exports = mongoose.model('User', userSchema)
