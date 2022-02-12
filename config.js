const dotenv = require('dotenv')
const path = require('path')
const sgMail = require('@sendgrid/mail')

// set location to get env
const localEnvPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({path: localEnvPath}) ? dotenv.config() : dotenv.config({path: localEnvPath})

const sendGridKey = process.env.SENDGRID_API_KEY
const verifiedEmail = process.env.EMAIL_USER

// SendGrid
sgMail.setApiKey(sendGridKey)

module.exports.sendVerificationEmail = (email, name, verificationCode, redirectUrl) => {
  const message = {
    from: {
      name: 'NakaraX <no-reply>',
      email: verifiedEmail
    },
    to: email,
    subject: 'Verify Your Email',
    text: `
      Hello ${name}\n
      Follow the link below to verify your email address\n
      https://nakara.herokuapp.com/api/auth/verify-email?code=${verificationCode}&redirectUrl=${redirectUrl}
    `,
    // html: `<h4>Hello ${name}</h4>
    //     <p>Follow the link below to verify your email address</p>
    //     <a href= "https://nakara.herokuapp.com/api/auth/verify-email?code=${verificationCode}&redirectUrl=${redirectUrl}">verify email</a>`
  }
  return sgMail.send(message)
}

module.exports.sendBuyCryptoEmail = () => {
  
  const message = {
    from: {
      name: 'NakaraX',
      email: verifiedEmail
    },
    to: verifiedEmail,
    subject: 'Buy Crypto Request',
    text: `I want to buy crypto`,
    // html: `<h2>Hello ${name}</h2>
    //     <p>Follow the link below to verify your email address</p>
    //     <a href= "https://nakara.herokuapp.com/api/auth/verify-email?code=${verificationCode}&redirectUrl=${redirectUrl}">verify email</a>`
  }
  return sgMail.send(message)
}