const mongoose = require('mongoose')

const VerifyId = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
    },
    idType: {
      type: String,
      required: true
    },
    movImage: {
      type: String,
      required: true
    },
    selfieImage: {
      type: String,
      required: true
    }
  }, 
  {timestamps: true},
  {collection: 'verifyid'},
)

module.exports = mongoose.model('verifyId', VerifyId)