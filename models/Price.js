const mongoose = require('mongoose')

const Price = new mongoose.Schema(
  {
    eth: {
      type: Number,
    },
    bnb: {
      type: Number,
    },
    btc: {
      type: Number,
    },
    busd: {
      type: Number,
    },
    doge: {
      type: Number,
    },
    usdt: {
      type: Number,
    },
  }, 
  {collection: 'price'},
)

module.exports = mongoose.model('price', Price)