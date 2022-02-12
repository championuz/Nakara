const router = require('express').Router()
const buyRequest = require('../models/Buy-crypto')
const {verifyToken} = require('./verifyToken')
const { sendBuyCryptoEmail } = require('../config')

const validateBuyCryptoInfo = (req, res, next) => {
  const {name, currency, amount, walletAddress, userId} = req.body

  if(!name || typeof name !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid name'})
  }
  else if(!currency || typeof currency !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid currency'})
  }
  else if(!amount || typeof amount !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid amount'})
  }
  else if(!walletAddress || typeof walletAddress !== 'string'){
    return res.json({status: 'error', message: 'Invalid wallet address'})
  }
  else if(!userId || typeof userId !== 'string'){
    return res.json({status: 'error', message: 'Invalid userId'})
  }
  else{
    next()
  }
}

// CREATE
router.post('/', validateBuyCryptoInfo, verifyToken, async(req, res) => {
  const {name, currency, amount, walletAddress} = req.body
  try{
    await buyRequest.create(req.body)
    try{
      await sendBuyCryptoEmail(name, currency, amount, walletAddress)
    }catch(err){
      return res.status(500).json({status: 'error', error:'adminEmailError', message:'Failed to send email to admin'})
    }
    res.status(200).json({status: 'ok'})
  }catch(err){  
    res.status(500).json({status:'error'})
  }
})

// SEND EMAIL TO ADMIN
router.post('/send-admin-email', validateBuyCryptoInfo, verifyToken, async(req, res) => {
  const {name, currency, amount, walletAddress} = req.body
  try{
    await sendBuyCryptoEmail(name, amount, walletAddress)
    res.status(200).json({status: 'ok'})
  }catch(err){  
    return res.status(500).json({status: 'error', error:'adminEmailError', message:'Failed to send email to admin'})
  }
})

module.exports = router
