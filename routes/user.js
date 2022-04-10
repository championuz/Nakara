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

router.post('/addInterest/:id', verifyTokenAndAuthorization, async (req, res) => {
  const date = new Date()
  const today = date.getTime()

  try{
    const user = await User.findById(req.params.id)
    const {wallet} = user._doc
    const {lockedAmount, interestTime} = wallet

    if(lockedAmount < 1) return res.status(422).json({
      status: 'error', 
      error: 'insufficientLockedAmount', 
      message: "can't recieve interest. Insufficient locked fund"
    })

    if(lockedAmount >= 1 && interestTime === 0){ 
      const tomorrow = date.setDate(date.getDate() + 1)
      await User.updateOne({_id: req.params.id}, {
        $set: {'wallet.interestTime' : tomorrow}
      })
      return res.status(200).json({status: 'ok'})
    }

    // if(interestTime > 0 && interestTime <= today){
    //   await User.updateOne({_id: req.params.id}, {
    //     $set: {'wallet.lockedAmount' : }
    //   })
    // }
    
  }catch(err){
    res.status(500).json({status:'error', message:'Unable to add interest'})
  }
})

module.exports = router