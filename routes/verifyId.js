const router = require('express').Router()
const verifyId = require('../models/VerifyId')
const {verifyTokenAndAuthorization} = require('./verifyToken')
const User = require('../models/User')
const { sendIdVerifyAdminEmail, sendIdVerifyUserEmail } = require('../services')

const validateIdInfo = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {name,email, phoneNumber, idNumber, idType, selfieImage, movImage} = req.body

  if(!name || typeof name !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid name'})
  }
  else if(!phoneNumber || typeof phoneNumber !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid phone number'})
  }
  else if(!email.match(emailValidator)){
    return res.status(401).json({status: 'error', message: 'Invalid email'})
  }
  else if(!idNumber || typeof idNumber !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid id number'})
  }
  else if(!idType || typeof idType !== 'string'){
    return res.json({status: 'error', message: 'Invalid id type'})
  }
  else if((!selfieImage && !movImage) || typeof (selfieImage && movImage) !== 'string'){
    return res.json({status: 'error', message: 'Image is required'})
  }
  else{
    next()
  }
}

// CREATE
router.post('/:id', validateIdInfo, verifyTokenAndAuthorization, async(req, res) => {
  let userDoc = {}

  try{
    await verifyId.create(req.body)
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({status: 'error', message: 'User not found'})

    // Modify the id status of the user if he/she is unverfied
    const {idStatus} = user._doc
    if(idStatus === 'Unverified'){
      userDoc = await User.findOneAndUpdate({_id: req.params.id}, {idStatus: 'Pending'}, {
        new: true
      })
    }else{
      userDoc = user
    }
    try{
      await sendIdVerifyAdminEmail(req.body)
      await sendIdVerifyUserEmail(req.body)
      res.status(200).json({status: 'ok', data: {idStatus: userDoc._doc.idStatus}})
    }catch(err){
      res.status(500).json({status: 'error', error:'emailSendError', message:'Failed to send email'})
    }
  }catch(err){
    res.status(500).json({status:'error', message:'Failed to verify ID'})
  }
})

module.exports = router