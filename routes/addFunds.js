const router = require('express').Router()
const addFundsRequest = require('../models/AddFunds')
const {verifyToken} = require('./verifyToken')
const { addFundsAdminEmail, addFundsUserEmail } = require('../services')

const validateAddFundsInfo = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {name, email, cardDetails, amount, userId} = req.body

  if(!name || typeof name !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid name'})
  }
  else if(!email.match(emailValidator)){
    return res.status(401).json({status: 'error', message: 'Invalid email'})
  }
  else if(!cardDetails || typeof cardDetails !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid gift card detail'})
  }
  else if(!amount || typeof amount !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid amount'})
  }
  else if(!userId || typeof userId !== 'string'){
    return res.json({status: 'error', message: 'Invalid userId'})
  }
  else{
    next()
  }
}

// CREATE
router.post('/', validateAddFundsInfo, verifyToken, async(req, res) => {
  try{
    await addFundsRequest.create(req.body)
    try{
      await addFundsAdminEmail(req.body)
      await addFundsUserEmail(req.body)
      res.status(200).json({status: 'ok'})
    }catch(err){
      res.status(500).json({status: 'error', error:'emailSendError'})
    }
  }catch(err){
    res.status(500).json({status:'error', message:'Failed to send request to redeem gift card'})
  }
})

// SEND EMAIL TO ADMIN AND EMAIL
router.post('/send-admin&user-email', validateAddFundsInfo, verifyToken, async(req, res) => {
  try{
    await addFundsAdminEmail(req.body)
    await addFundsUserEmail(req.body)
    res.status(200).json({status: 'ok'})
  }catch(err){
    res.status(500).json({status: 'error', error:'emailSendError'})
  }
})

module.exports = router