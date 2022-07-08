// import mongoose
const mongoose = require('mongoose')

// create schema
const taskSchema = new mongoose.Schema({
    username:{type:String,required:[true, 'Username is Mandatory']},
    taskCollection:Array
},{collection:'collectionOne'})
// create Model
const taskModel = new mongoose.model('task',taskSchema)
// export taskModel
module.exports=taskModel