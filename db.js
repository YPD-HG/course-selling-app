const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

// Schema
const userSchema = new Schema({
    email: {type:String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const adminSchema = new Schema({
    email: {type:String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
})

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId,
})

// Model
const UserModel = mongoose.model('user', userSchema)
const AdminModel = mongoose.model('admin', adminSchema)
const CourseModel = mongoose.model('course', courseSchema)
const PurchaseModel = mongoose.model('purchase', purchaseSchema)

module.exports={
   UserModel:UserModel,
  AdminModel,
   CourseModel,
 PurchaseModel
}