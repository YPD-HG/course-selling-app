require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')

const userRoute = require('./routes/user')
const courseRoute = require('./routes/course')
const { adminRouter } = require('./routes/admin')

app.use(express.json())
app.use(cors())

const port = 3000;
app.use('/user', userRoute)
app.use('/course', courseRoute)
app.use('/admin', adminRouter)

function main() {    
    mongoose.connect(process.env.MONGOOSE_STRING)
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    })
}

main()
