require('dotenv').config()
const jwt = require('jsonwebtoken')
const {AdminModel} = require('../db')

async function adminMiddleware(req, res, next) {
    const token = req.headers.token;
    if (token) {
        try {
            const AdminId = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
            console.log("AdminId : ", AdminId);
            if (AdminId) {
                let Admin = await AdminModel.findById(AdminId)
                if (!Admin) {
                    console.log("Admin not found");
                }
                req.adminId = Admin;
                next();
            }
        } catch (e) {
            console.log("error in verificatin of Admin token : ", e);
            return res.send(401).json({
                message: "Invalid Token"
            })
        }
    }
}

module.exports={
    adminMiddleware
}