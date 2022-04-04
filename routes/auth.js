const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const { sendVerificationEmail } = require('../services')

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

  try{
    const savedUser = await User.create({
      name,
      email,
      password: encryptedPass,
    })
    const {password, ...others} = savedUser._doc
    const token = savedUser.generateVerificationToken()
    res.status(200).json({status:'ok', data: {...others, verificationCode: token}})
  }catch(err){
    // duplicate key error
    if(err.code === 11000){
      return res.status(409).json({status: 'error', message: 'Email already exists'})
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

    const {password, ...others} = user._doc

    if (user.emailVerified !== true) {
      const token = user.generateVerificationToken()
      return res.status(401).json({
        status:'error', message: "Unverified Account. Please Verify Your Email!", data: {...others, verificationCode: token}
      })
    }

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SECT,
      {expiresIn: '1d'}
    )

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
  const token = req.query.code

  // return error response if token is mission
  if (!token) {
    return res.status(422).json({status: 'error', message:'Missing Token'})
  }
  
  // Check for expiry of token
  const exp = jwt.decode(token).exp
  if(!exp) return res.status(403).json({status: 'error', message: 'Token is invalid'})
  if (Date.now() >= exp * 1000) return res.status(403).json({status:'error', expired: true, message: 'Token has expired'})

  // verify token
  let tokenPayload = null
  jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET, (err, user) => {
    if(err) return res.status(403).json({status: 'error', message: 'Token is invalid'})
    tokenPayload = user
  })

  // find, update user verification status and save user
  try{
    const user = await User.findOne({ _id: tokenPayload.id })
    if (!user) {
      return res.status(404).json({ status: 'error', message: "User not found." })
    }
    user.emailVerified = true
    await user.save()
    res.redirect(req.query.redirectUrl)
  }catch(err){
    res.status(500).json({status: 'error', message: 'An error occured while verifing your email'}) 
  }
})

module.exports = router