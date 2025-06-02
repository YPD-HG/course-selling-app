const { Router } = require('express')
const { userMiddleware } = require('../middleware/user')
const { PurchaseModel, CourseModel } = require('../db')
const courseRouter = Router();

courseRouter.get('/purchase', userMiddleware, async (req, res) => {
    let userId = req.userData._id
    let courseId = req.headers.courseid;

    try {
        await PurchaseModel.create({
            userId,
            courseId
        })
        res.json({
            message: "Purchase Succesful."
        })
    } catch (e) {
        console.log("Error while shoving purchased data in db", e)
    }
})

courseRouter.get('/preview', async (req, res) => {

    // It shows the user all the courses that exists.
    try {
        const AllCourses = await CourseModel.find({})

        if (AllCourses) {
            res.json({
                message: "All courses fetched succesfully.",
                AllCourses
            })
        } else {
            res.json({
                mesage: "We have no course currently"
            })
        }
    } catch (e) {
        console.log("Error while fetching all courses from DB", e)
    }
})

module.exports = courseRouter;