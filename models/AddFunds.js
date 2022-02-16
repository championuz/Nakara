const mongoose = require('mongoose')

const AddFundsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true
    },
    name: {
      type: String,
      required: true,
    },
    cardDetails: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
  }, 
  {collection: 'addFundsRequests'},
  {timestamps: true}
)

module.exports = mongoose.model('addFundsRequest', AddFundsSchema)