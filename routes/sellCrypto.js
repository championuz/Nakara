const router = require('express').Router()
const sellRequest = require('../models/SellCrypto')
const {verifyToken} = require('./verifyToken')
const { sendSellCryptoAdminEmail, sendSellCryptoUserEmail } = require('../config')

const validateSellCryptoInfo = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {name, email, currency, amount, bankName, accountName, accountNumber, img, userId} = req.body

  if(!name || typeof name !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid name'})
  }
  else if(!email.match(emailValidator)){
    return res.status(401).json({status: 'error', message: 'Invalid email'})
  }
  else if(!currency || typeof currency !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid currency'})
  }
  else if(!amount || typeof amount !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid amount'})
  }
  else if(!bankName || typeof bankName !== 'string'){
    return res.json({status: 'error', message: 'Invalid bank name'})
  }
  else if(!userId || typeof userId !== 'string'){
    return res.json({status: 'error', message: 'Invalid userId'})
  }
  else if(!accountName || typeof accountName !== 'string'){
    return res.json({status: 'error', message: 'Invalid account name'})
  }
  else if(!accountNumber || typeof accountNumber !== 'string'){
    return res.json({status: 'error', message: 'Invalid account number'})
  }
  else if(!img || typeof img !== 'string'){
    return res.json({status: 'error', message: 'Image is required'})
  }
  else{
    next()
  }
}

// CREATE
router.post('/', validateSellCryptoInfo, verifyToken, async(req, res) => {
  try{
    await sellRequest.create(req.body)
    try{
      await sendSellCryptoAdminEmail(req.body)
      await sendSellCryptoUserEmail(req.body)
      res.status(200).json({status: 'ok'})
    }catch(err){
      res.status(500).json({status: 'error', error:'emailSendError', message:'Failed to send email'})
    }
  }catch(err){
    res.status(500).json({status:'error', message:'Failed to send request to sell crypto'})
  }
})

// SEND EMAIL TO ADMIN AND EMAIL
router.post('/send-admin&user-email', validateSellCryptoInfo, verifyToken, async(req, res) => {
  try{
    await sendSellCryptoAdminEmail(req.body)
    await sendSellCryptoUserEmail(req.body)
    res.status(200).json({status: 'ok'})
  }catch(err){
    res.status(500).json({status: 'error', error:'emailSendError', message:'Failed to send email'})
  }
})

module.exports = router