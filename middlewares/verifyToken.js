const jwt = require("jsonwebtoken")

require("dotenv").config()

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        res.status(401).end()
    }

    try {
        const secret = process.env.JWT_SECRET
        jwt.verify(token, secret)
        next()
    }
    catch { res.status(400).end() }
}

module.exports = verifyToken;