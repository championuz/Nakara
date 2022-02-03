const dotenv = require('dotenv')
const path = require('path')
const sgMail = require('@sendgrid/mail')

// set location to get env
const localEnvPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({path: localEnvPath}) ? dotenv.config() : dotenv.config({path: localEnvPath})

const sendGridKey = process.env.SENDGRID_API_KEY
const verifiedEmail = process.env.EMAIL_USER

sgMail.setApiKey(sendGridKey)

module.exports.sendVerificationEmail = (email, name, verificationCode, redirectUrl) => {
  const message = {
    to: email,
    from: {
      name: 'NakaraX <no-reply>',
      email: verifiedEmail
    },
    subject: 'Verify Your Email',
    text: `akmjfamdfmaldfmaldfmaklfmldfkmandkamf`,
    html: `<h2>Hello ${name}</h2>
        <p>Follow the link below to verify your email address</p>
        <a href= "https://nakara.herokuapp.com/api/auth/verify-email?code=${verificationCode}&redirectUrl=${redirectUrl}">verify email</a>`
  }
  return sgMail.send(message)
}