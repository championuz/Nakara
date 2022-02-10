const router = require('express').Router()
const User = require('../models/User')
const {verifyTokenAndAuthorization} = require('./verifyToken')

// GET USER
router.get('/find/:id', verifyTokenAndAuthorization, async (req, res) => {
  try{
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({status: 'error', message: 'User not found'})

    const {password, verificationCode,  ...others} = user._doc
    res.status(200).json({status: 'ok', data: others})
  }catch(err){
    res.status(500).json({status:'error', message:'An Error occured while trying to get user'}) 
  }
})

module.exports = router