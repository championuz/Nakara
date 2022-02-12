const router = require('express').Router()
const buyRequest = require('../models/Buy-crypto')
const {verifyToken} = require('./verifyToken')
const { sendBuyCryptoEmail } = require('../config')

const validateBuyCryptoInfo = (req, res, next) => {
  const {name, amount, walletAddress} = req.body

  if(!name || typeof name !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid name'})
  }
  else if(!amount || typeof amount !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid amount'})
  }
  else if(!walletAddress || typeof walletAddress !== 'string'){
    return res.json({status: 'error', message: 'Invalid wallet address'})
  }
  else{
    next()
  }
}

// CREATE
router.post('/', validateBuyCryptoInfo, verifyToken, async(req, res) => {
  try{
    const savedBuyRequest = await buyRequest.create(req.body)
    sendBuyCryptoEmail()
    res.status(200).json({status: 'ok',  data: savedBuyRequest})

  }catch(err){  
    res.status(500).json({status:'error'})
  }
})

module.exports = router
