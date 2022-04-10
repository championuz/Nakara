const mongoose = require('mongoose')

const SellCryptoSchema = new mongoose.Schema(
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
    bankName: {
      type: String,
      required: true
    },
    accountName: {
      type: String, 
      required: true
    },
    accountNumber: {
      type: String, 
      required: true
    },
    img: {
      type: String,
      required: true
    }
  }, 
  {timestamps: true},
  {collection: 'sellRequests'},
)

module.exports = mongoose.model('sellRequest', SellCryptoSchema)