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
      type: String,
      required: true,
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
  {collection: 'sellRequests'},
  {timestamps: true}
)

module.exports = mongoose.model('sellRequest', SellCryptoSchema)