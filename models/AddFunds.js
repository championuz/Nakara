const mongoose = require('mongoose')

const AddFundsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true
    },
    bankName: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    }
  }, 
  {timestamps: true},
  {collection: 'addFundsRequests'},
)

module.exports = mongoose.model('addFundsRequest', AddFundsSchema)