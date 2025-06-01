const { Router } = require('express')
const courseRouter = Router();

courseRouter.get('/purchase', (req, res) => {
    res.json({
        message: "course endpoint"
    })
})

courseRouter.get('/preview', (req, res) => {
    res.json({
        message: "All the purchased courses"

    })
})

module.exports = courseRouter;