const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    emailVerified: {
      type: Boolean, 
      enum: [false, true],
      default: false
    },
    verificationCode: { 
      type: String, 
      unique: true 
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    img: {
      type: String
    }
  }, 
  {collection: 'users'},
  {timestamps: true}
)

module.exports = mongoose.model('User', UserSchema)