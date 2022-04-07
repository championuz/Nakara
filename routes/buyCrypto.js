const router = require('express').Router()
const buyRequest = require('../models/BuyCrypto')
const User = require('../models/User')
const {verifyToken} = require('./verifyToken')
const { sendBuyCryptoAdminEmail, sendBuyCryptoUserEmail } = require('../services')

const validateBuyCryptoInfo = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {name, email, currency, amount, walletAddress, userId} = req.body

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
  const {amount, userId} = req.body
  const numAmount = Number(amount)
  try{
    const user = await User.findById(userId)
    const {wallet} = user._doc
    // check if the requested amout is greater that the available amount 
    // then send and error response if the greater than and if not greter than minus 
    // the requested amount the the available amount and upate the database
    if(numAmount > wallet.availableAmount){
      return res.status(422).json({status: 'error', error:'insufficientBalance', message: 'You wallet balance is less that the amount requested'})
    }
    const currentWalletAmount = wallet.availableAmount - amount
    await User.updateOne({_id: userId}, {
      $set: {'wallet.availableAmount' : currentWalletAmount}
    })

    await buyRequest.create(req.body)
    try{
      await sendBuyCryptoAdminEmail(req.body)
      await sendBuyCryptoUserEmail(req.body)
      res.status(200).json({status: 'ok'})
    }catch(err){
      res.status(500).json({status: 'error', error:'emailSendError', message:'Failed to send email'})
    }
  }catch(err){
    res.status(500).json({status:'error', message:'Failed to send request to buy crypto'})
  }
})


// SEND EMAIL TO ADMIN AND EMAIL
router.post('/send-admin&user-email', validateBuyCryptoInfo, verifyToken, async(req, res) => {
  try{
    await sendBuyCryptoUserEmail(req.body)
    await sendBuyCryptoAdminEmail(req.body)
    res.status(200).json({status: 'ok'})
  }catch(err){
    res.status(500).json({status: 'error', error:'emailSendError', message:'Failed to send email'})
  }
})

module.exports = router