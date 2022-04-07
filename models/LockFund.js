const mongoose = require('mongoose')

const LockFunds = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    }
  },
  {timestamps: true},
  {collection: 'LockFunds'},
)

module.exports = mongoose.model('lockFunds', LockFunds)