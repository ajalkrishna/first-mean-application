const mongoose = require('mongoose')

// create user schema

const userSchema = new mongoose.Schema({
    username:{type:String,required:[true,'username is mandatory']},
    password:{type:String,required:true},
    email:{type:String,required:[true,'email id is mandatory']},
    city:String,
    profilePic:String,
    status:{type:Boolean,default:true}
})

// userModel
const userModel = mongoose.model('user',userSchema)

module.exports = userModel