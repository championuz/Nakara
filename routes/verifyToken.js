const jwt = require('jsonwebtoken')

// checking for validity of token
const verifyToken = (req, res, next) => {
  const authHeader= req.headers.token
  if(authHeader){
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECT, (err, user) => {
      if(err) return res.status(403).json('Token is not valid')
      req.user = user
      next()
    })
  }else{
    return res.status(401).json('You are not authenticated! '+ authHeader +'')
  }
}

// Authorizing actions for verified users and admins
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.id === req.params.id || req.user.isAdmin){
      next()
    }else{
      res.status(403).json('Operation not allowed!') 
    }
  })
}

// Authorizing action for only admins
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.isAdmin){
      next()
    }else{
      res.status(403).json('Operation not allowed!')
    }
  })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}