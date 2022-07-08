const jwt = require('jsonwebtoken')
require('dotenv').config()

// create a middle ware for verifying bearer token

const verifyToken = (req, res, next) => {
    // get bearer token
    let bearerToken = req.headers.authorization;
    // if bearer token is undefined
    if (bearerToken == undefined) {
       return res.send({ message: 'unauthorized request' })
    }
    // extract brearer token 
    let token = bearerToken.split(' ')[1]
    // console.log(token)
    try{
        jwt.verify(token, process.env.SECRET_KEY)
        // if token is valid
        next()
    }
    catch(err){
        next(new Error("Session Expired...."))
    }
}

module.exports = verifyToken