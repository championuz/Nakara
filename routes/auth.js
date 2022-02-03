const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const { sendVerificationEmail } = require('../config')

const validateCredentials = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {name, email, password} = req.body

  if(!name || typeof name !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid name'})
  }
  else if(!email.match(emailValidator)){
    return res.status(401).json({status: 'error', message: 'Invalid email'})
  }
  else if(!password || typeof password !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid password'})
  }
  else if(password.length < 5){
    return res.json({status: 'error', message:'Password too short. Should be at least 6 characters'})
  }
  else{
    next()
  }
}

// Register
router.post('/register', validateCredentials, async (req, res) => {
  const {name, email, password} = req.body
  const encryptedPass = CryptoJS.AES.encrypt(password, process.env.PASS_ENC_SECT).toString()
  const token = jwt.sign({email}, process.env.JWT_SECT)

  try{
    const savedUser = await User.create({
      name,
      email,
      password: encryptedPass,
      verificationCode: token,
    })
    res.status(200).json({status:'ok', data: savedUser})
  }catch(err){
    // duplicate key error
    if(err.code === 11000){
      return res.status(500).json({status: 'error', message: 'Email already exists'})
    }
    // if(err.code === 11000 && err.keyPattern.name){
    //   return res.status(500).json({status: 'error', message: 'name already exists'})
    // }
    // if(err.code === 11000 && err.keyPattern.email){
    //   return res.status(500).json({status: 'error', message: 'Email already exists'})
    // }
    throw err
  }
})

// LOGIN
router.post('/login', async(req, res) => {
  try{
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(401).json({status: 'error', message: 'Invalid Email/Password'})

    const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_ENC_SECT)
    const Originalpassword = hashPassword.toString(CryptoJS.enc.Utf8)
    if (Originalpassword !== req.body.password) return res.status(401).json({status: 'error', message: 'Invalid Email/Password'})

    if (user.emailVerified !== true) {
      return res.status(401).json({
        status:'error', message: "Unverified Account. Please Verify Your Email!", data: user
      })
    }

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SECT,
      {expiresIn: '3d'}
    )

    const {password, ...others} = user._doc
    res.status(200).json({status:'ok', data: {...others, accessToken}})
  }catch(err){  
    res.status(500).json({status: 'error', message: 'An error occured while trying to login'}) 
  }
})

// Send email verification
router.post('/send-email-verification', async(req, res) => {
  const {email, name, verificationCode} = req.body.data
  const redirectUrl = req.body.redirectUrl
  try{
    await sendVerificationEmail( 
      email,
      name,
      verificationCode,
      redirectUrl
    )
    res.status(200).json({status:'ok'})
  }catch(err){
    res.status(500).json({status:'error', error:err})
  }
})

// verify email address
router.get('/verify-email', async(req, res) => {
  try{
    const user = await User.findOne({
      verificationCode: req.query.code,
    })
    if (!user) {
      return res.status(404).json({ status: 'error', message: "User Not found." })
    }
    user.emailVerified = true
    const savedUser = await user.save()
    res.redirect(req.query.redirectUrl)
  }catch(err){
    res.status(500).json({status: 'error', message: 'An error occured while verifing your email'}) 
  }
})
 
module.exports = router