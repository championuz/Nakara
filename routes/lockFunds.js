const router = require('express').Router()
const {verifyToken} = require('./verifyToken')
const { lockFundsAdminEmail, lockFundsUserEmail} = require('../services')
const LockFund = require('../models/LockFund')

const validateLockFunds = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {name, email, amount, duration} = req.body

  if(!name || typeof name !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid name'})
  }
  else if(!amount || typeof amount !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid amount'})
  }
  else if(!email.match(emailValidator)){
    return res.status(401).json({status: 'error', message: 'Invalid email'})
  }
  else if(!duration || typeof duration !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid duration'})
  }
  else{
    next()
  }
}

// CREATE
router.post('/', validateLockFunds, verifyToken, async(req, res) => {

  try{
    const createdLockFunds = await LockFund.create(req.body)
    const date = new Date(createdLockFunds.createdAt).toLocaleDateString()
    try{
      await lockFundsAdminEmail(req.body, date)
      await lockFundsUserEmail(req.body, date)
      res.status(200).json({status: 'ok'})
    }catch(err){
      res.status(500).json({status: 'error', error:'emailSendError', message:'Failed to send email'})
    }
  }catch(err){
    res.status(500).json({status:'error', message:'Failed to send lock funds request'})
  } 
})

module.exports = router