const jwt = require('jsonwebtoken')
require('dotenv').config

const secret_key = process.env.SECRET_KEY 
const authMiddleware =  async(req, res, next) => {
    try {
        // console.log('Authorization:', req.headers.authorization) 
        const token = req.headers.authorization.split(' ')[1]
        // console.log(token)
        if (token) {
            const decoded = await jwt.verify(token, secret_key)
            req.body._id = decoded.userId
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

module.exports = authMiddleware
