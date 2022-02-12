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
      name: 'NakaraX@noreply',
      email: verifiedEmail
    },
    to: email,
    subject: 'Verify your email address',
    text: `Hello ${name}\n Follow this link to verify your email address.
    https://nakara.herokuapp.com/api/auth/verify-email?code=${verificationCode}&redirectUrl=${redirectUrl}\nif you didn't ask to verify this address, you can ignore this email.\nThanks.
    `,
    html: 
    `
     <h4>Hello ${name}</h4>
     <p>Follow this link to verify your email address.</p>
     <a href= "https://nakara.herokuapp.com/api/auth/verify-email?code=${verificationCode}&redirectUrl=${redirectUrl}">verify email</a><br/>
     <p>if you didn't ask to verify this address, you can ignore this email.</p><br/>
     <p>Thanks.<p>
    `
  }
  return sgMail.send(message)
}

module.exports.sendBuyCryptoAdminEmail = ({name, currency, amount, walletAddress}) => {
  const message = {
    from: {
      name: 'NakaraX',
      email: verifiedEmail
    },
    to: verifiedEmail,
    subject: 'Buy Crypto Request',
    text: `
      Name: ${name}\n
      currency: ${currency}
      Amount: ${amount}\n
      Wallet Address: ${walletAddress}\n
    `,
    html: `
      <p>
        <strong>Name:</strong> ${name}<br/>
        <strong>Currency:</strong> ${currency}<br/>
        <strong>Amount:</strong> ${amount}<br/>
        <strong>Wallet address:</strong> ${walletAddress}
      </p>
    `
  }
  return sgMail.send(message)
}

module.exports.sendBuyCryptoUserEmail = ({name, email, currency, amount, walletAddress}) => {
  const message = {
    from: {
      name: 'NakaraX@noreply',
      email: verifiedEmail
    },
    to: email,
    subject: 'Buy Crypto Request',
    text: `Your request is processing\n
      Name: ${name}\n
      Amount: ${amount}\n
      Wallet Address: ${walletAddress}\n
    `,
    html: `
      <div>
        <h3>Your request is processing</h3>
        <h4>Here are your details:</h4>
        <p>
          <strong>Name:</strong> ${name}<br/>
          <strong>Currency:</strong> ${currency}<br/>
          <strong>Amount:</strong> ${amount}<br/>
          <strong>Wallet address:</strong> ${walletAddress}
        </p>
      <div>
    `
  }
  return sgMail.send(message)
}

module.exports.sendSellCryptoAdminEmail = ({name, amount, walletAddress}) => {

}

module.exports.sendSellCryptoUserEmail = ({name, amount, walletAddress}) => {

}

