require('dotenv').config()
const jwt = require('jsonwebtoken')
const { UserModel } = require('../db')

async function userMiddleware(req, res, next) {
    const token = req.headers.token;
    if (token) {
        try {
            const userId = jwt.verify(token, process.env.JWT_SECRET_USER);
            if (userId) {
                let user = await UserModel.findById(userId)
                if (!user) {
                    res.json({
                        message: "User not found."
                    })
                }
                req.userData = user;
                next();
            }
        } catch (e) {
            console.log("error in verificatin of User token : ", e);
            return res.send(401).json({
                message: "Invalid Token"
            })
        }
    } else {
        res.json({
            message: "Token missing"
        })
    }
}

module.exports = {
    userMiddleware
}