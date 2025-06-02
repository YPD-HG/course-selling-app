require('dotenv').config();

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require('bcrypt')
const { z } = require('zod')

const { UserModel, PurchaseModel, CourseModel } = require('../db')
const { userMiddleware } = require('../middleware/user')

const userRouter = express.Router();
// mongoose.connect(process.env.MONGOOSE_STRING)
// userRouter.use(userMiddleware);


userRouter.post('/signup', async (req, res) => {
    const userCredentials = z.object({
        email: z
            .string()
            .email(),
        password: z
            .string()
            .min(5)
            .regex(new RegExp('^(?=.*?[a-z]).{5,}$'), {
                message:
                    'Password must be at least 5 characters '
            }),
        firstName: z
            .string(),
        lastName: z
            .string()
    })
    let { email, password, firstName, lastName } = req.body

    const result = userCredentials.safeParse({ email: email, password: password, firstName: firstName, lastName: lastName });
    if (result.success) {
        let foundUser = await UserModel.find({
            email
        })
        password = await bcrypt.hash(password, 10)
        if (foundUser.length == 0) {
            try {
                await UserModel.create({
                    email,
                    password,
                    firstName,
                    lastName
                })
                res.json({
                    message: "User signed up."
                })
            } catch (error) {
                console.log("Error while shoving data in database : ", error);
            }

        } else {
            return res.json({
                message: "Email already exist."
            })
        }
    } else {
        res.json({
            message: "Password should be of 5 character atleast"
        })
    }

})

userRouter.post('/signin', async (req, res) => {
    let { email, password } = req.body;

    let foundUser = await UserModel.findOne({
        email
    })

    if (foundUser) {
        let passwordCheck = await bcrypt.compare(password, foundUser.password)
        if (passwordCheck) {
            let id = foundUser._id.toString();
            try {
                const token = jwt.sign(id, process.env.JWT_SECRET_USER);
                res.json({
                    token,
                    message: "Token created succesfully"
                })
            } catch (e) {
                console.log("Error in Jwt Sign : ", e);
            }
        } else {
            return res.json({
                message: "Wrong Password."
            })
        }
    } else {
        res.json({
            message: "User doesn't exist, signup."
        })
    }
})

userRouter.post('/purchases', userMiddleware, async (req, res) => {
    let userId = req.userData._id;

    try {
        let AllPurchasedCourses = await PurchaseModel.find({
            userId
        })
        if (AllPurchasedCourses) {

            // Find me the course data whose 'id' is 'in', this array  AllPurchasedCourses.map(x => x.courseId)
            const courseData = await CourseModel.find({
                _id: { $in: AllPurchasedCourses.map(x => x.courseId) }
            })

            // Fetch all course documents whose _id matches any courseId from the AllPurchasedCourses array.
            // AllPurchasedCourses contains objects with userId and courseId.
            // .map(x => x.courseId) extracts all courseIds, and $in filters the courses by these IDs.


            res.json({
                AllPurchasedCourses,
                courseData
            })
        }
    } catch (e) {
        console.log("Error while finding the course.", e)
    }
})

module.exports = userRouter;