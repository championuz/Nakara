const router = require('express').Router()
const addFundsRequest = require('../models/AddFunds')
const {verifyToken} = require('./verifyToken')
const { addFundsAdminEmail, addFundsUserEmail } = require('../services')

const validateAddFundsInfo = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {bankName, email, accountName, amount, img} = req.body

  if(!bankName || typeof bankName !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid bank name'})
  }
  else if(!email.match(emailValidator)){
    return res.status(401).json({status: 'error', message: 'Invalid email'})
  }
  else if(!accountName || typeof accountName !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid account name'})
  }
  else if(!amount || typeof amount !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid amount'})
  }
  else if(!img || typeof img !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid image'})
  }
  else{
    next()
  }
}

// CREATE
router.post('/', validateAddFundsInfo, verifyToken, async(req, res) => {
  try{
    const addFundsData = await addFundsRequest.create(req.body)
    const date = new Date(addFundsData.createdAt).toLocaleDateString()
    try{
      await addFundsAdminEmail(req.body, date)
      await addFundsUserEmail(req.body, date)
      res.status(200).json({status: 'ok'})
    }catch(err){
      res.status(500).json({status: 'error', error:'emailSendError'})
    }
  }catch(err){
    res.status(500).json({status:'error', message:'Failed send add funds request'})
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