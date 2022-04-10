const mongoose = require('mongoose')

const BuyCryptoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true
    },
    name: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    amount: {
      type: Object,
      required: true,
      default: {
        currencyAmount: '',
        nairaAmount: ''
      }
    },
    walletAddress: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean, 
      enum: [false, true],
      default: false
    }
  }, 
  {timestamps: true},
  {collection: 'buyRequests'},
)

module.exports = mongoose.model('buyRequest', BuyCryptoSchema)