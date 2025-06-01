const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod')
const bcrypt = require('bcrypt')
const adminRouter = Router();
const { AdminModel, CourseModel } = require('../db');
const { adminMiddleware } = require('../middleware/admin')

// adminRouter.use(adminMiddleware)

adminRouter.post('/signup', async (req, res) => {
    const adminCredentials = z.object({
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
    const result = adminCredentials.safeParse({ email: email, password: password, firstName: firstName, lastName: lastName });
    if (result.success) {
        let foundAdmin = await AdminModel.find({
            email
        })
        console.log("Found Admin : ", foundAdmin.length);
        password = await bcrypt.hash(password, 10)
        console.log("Password : ", password);
        if (foundAdmin.length == 0) {
            console.log("New Admin");
            try {
                await AdminModel.create({
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName
                })

                res.json({
                    message: "Admin signed up."
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

adminRouter.post('/signin', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let foundAdmin = await AdminModel.findOne({
        email
    })
    if (foundAdmin) {
        let passwordCheck = await bcrypt.compare(password, foundAdmin.password)
        console.log("PasswordCheck : ", passwordCheck);
        if (passwordCheck) {
            let id = foundAdmin._id.toString();
            try {
                const token = jwt.sign(id, process.env.JWT_SECRET_ADMIN);
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
            message: "Admin doesn't exist, signup."
        })
    }
})

adminRouter.post('/course', adminMiddleware, async (req, res) => {
    const adminId = req.adminId;
    console.log(adminId);

    let { title, description, price, imageurl } = req.body;

    try {
        let course = await CourseModel.create({
            title,
            description,
            price,
            imageurl,
            creatorId: adminId
        })
        res.json({
            message: "Admin creating course",
            courseId: course._id
        })
    } catch (error) {
        console.log("Error while shoving course data in Database : ", error);
    }
})

adminRouter.put('/course', adminMiddleware, async (req, res) => {
    // Probably we will be supplied the courseId for the course that need to be updated.
    let { title, description, price, imageurl } = req.body;
    console.log(title, description, price, imageurl);

    let userData = {};
    if (title !== undefined) {
        userData['title'] = title;
    }
    if (description !== undefined) {
        userData['description'] = description;
    }
    if (price !== undefined) {
        userData['price'] = price;
    }
    if (imageurl !== undefined) {
        userData['imageurl'] = imageurl;
    }

    console.log("User Data : ", userData);
    console.log("User Data Title : ", userData.title);

    let courseId = req.headers.courseid.toString();

    if (courseId) {
        let findCourse = await CourseModel.findById({
            _id: courseId
        })
        console.log("findCourse : ", findCourse);
        if (findCourse) {
            try {
                let updatedData = await CourseModel.updateOne(
                    { _id: courseId },
                    { $set: userData }
                )
                console.log("Updated Data : ", updatedData);
                res.json({
                    message: "Data Updated succesfully!"
                })

            } catch (e) {
                res.json({
                    message: "Error while updating data in database : ", e
                })
            }
        } else {
            res.json({
                message: "Course doesn't exist."
            })
        }

    } else {
        res.json({
            message: "Invalid CourseId"
        })
    }
})

adminRouter.get('/course/bulk', adminMiddleware, async (req, res) => {
    let adminId = req.adminId;
    console.log(adminId);
    try {
        let allCourses = await CourseModel.find({
            creatorId: adminId
        })
        res.json({
            message: "fetched all courses succesfully!",
            allCourses
        })
    } catch (e) {
        res.json({
            message: "Issue in fetching all the courses."
        })
    }

})

adminRouter.post('/delete-course', adminMiddleware, (req, res) => {
    res.json({
        message: "Admin Deleting course"
    })
})

adminRouter.post('/add-course-content', adminMiddleware, (req, res) => {
    res.json({
        message: "Admin Adding course content"
    })
})

module.exports = {
    adminRouter: adminRouter
};