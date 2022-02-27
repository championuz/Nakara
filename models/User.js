const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

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
    wallet: {
      type: Object,
      default: {
        availableAmount: 0,
        lockedAmount: 0
      }
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    img: {
      type: String
    }
  }, 
  {timestamps: true},
  {collection: 'users'},
)

UserSchema.methods.generateVerificationToken = function () {
  const user = this
  const verificationToken = jwt.sign(
    { id: user._id },
    process.env.VERIFICATION_TOKEN_SECRET,
    { expiresIn: "900s" }
)
  return verificationToken
}


module.exports = mongoose.model('User', UserSchema)