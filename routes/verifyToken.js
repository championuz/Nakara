const jwt = require('jsonwebtoken')

// checking for validity of token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token
  if(authHeader){
    const token = authHeader.split(' ')[1]
    const exp = jwt.decode(token).exp
    if(!exp) return res.status(403).json({status: 'error', message: 'Token is invalid'})
    if (Date.now() >= exp * 1000) return res.status(403).json({status:'error', expired: true, message: 'Your session has expired'})
    jwt.verify(token, process.env.JWT_SECT, (err, user) => {
      if(err) return res.status(403).json({status: 'error', message: 'Token is invalid'})
      req.user = user
      next()
    })
  }else{
    return res.status(401).json({status: 'error', message:'You are not authenticated! '+ authHeader +''})
  }
}

// Authorizing actions for verified users and admins
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.id === req.params.id || req.user.isAdmin){
      next()
    }else{
      res.status(403).json({status: 'error', message: 'Operation not allowed!'}) 
    }
  })
}

// Authorizing action for only admins
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.isAdmin){
      next()
    }else{
      res.status(403).json({status: 'error', message: 'Operation not allowed!'})
    }
  })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}