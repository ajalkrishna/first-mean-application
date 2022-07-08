const exp = require('express')
const userApp= exp.Router()
const userModel = require('./models/UserModel')
const taskModel = require('./models/taskModel')
const bcryptjs = require('bcryptjs')
const expressAsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const verifyToken= require('./middlewares/verifyToken')
// import packages for multimedia data operation
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


userApp.use(exp.json())


// config cloudinary
cloudinary.config({
    cloud_name:'dk1kforq5',
    api_key:'362226974791292',
    api_secret:'6v2dFVDkfz9YZqgZ6wfjaFMdmsc'
})
// config multer-storage-cloudinary
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'UserProfiles',
      public_id: (req, file) => file.fieldname+'-'+Date.now(),
    },
  });
// config multer
const upload = multer({ storage: cloudinaryStorage });

//create user
userApp.post('/create-user',upload.single('photo'),expressAsyncHandler(async (req,res)=>{

    let imageCdn=req.file.path

    // take user data
    let userClientInfo=JSON.parse(req.body.signupObj)
    // check existance
    let userFromDb=await userModel.findOne({username:userClientInfo.username})
    // check existance
    if(userFromDb!==null){
        res.send({message:'false'})
    }
    else{
        // append image cdn
        userClientInfo.profilePic=imageCdn
        let userDoc = new userModel({...userClientInfo})
        // hash password
        let hashedPw= await bcryptjs.hash(userClientInfo.password,5)
        // replace 
        userDoc.password=hashedPw
        await userDoc.save()

        res.status(200).send({message:"true"})
    }


}))

// login user
userApp.post('/login',expressAsyncHandler(async (req,res)=>{
    let loginCreds=req.body
    // check existance
    let userFromDb=await userModel.findOne({username:loginCreds.username})
    // if no user
    if(userFromDb==null){
        res.send({message:'Invalid Username'})
    }
    else{
        // user exists and check the password
        let status = await bcryptjs.compare(loginCreds.password,userFromDb.password)
        if(status==false){
            res.status(200).send({message:'invalid password'})
        }
        else{
            let token = jwt.sign({username:userFromDb.username},process.env.SECRET_KEY,{expiresIn:100})
            res.status(200).send({message:'Login successful',token:token,user:userFromDb})

        }


    }
}))

// get user by username
userApp.get('/getuser/:username',expressAsyncHandler(async (req,res)=>{
    // get username from url
    let usernameFromUrl = req.params.username;
    // find the existance of usernameobj
    let userDataFromDb = await userModel.findOne({username:usernameFromUrl}).exec()
    // if it returns null
    if(userDataFromDb==null){
        res.status(200).send({message:'No user Found'})
    }
    // if user is existed
    else{
        res.status(200).send({message:'user found',payload:userDataFromDb})
    }

}))

// update user
userApp.put('/update-user',expressAsyncHandler(async (req,res)=>{
    let updateValue=req.body
    // update
    let result = await userModel.findOneAndUpdate({username:updateValue.username},{$set:{email:updateValue.email,city:updateValue.city}})
    if(result==null){
        res.send({message:'user not existed'})
    }
    else{
        res.status(200).send({message:`details of ${updateValue.username} updated`})

    }
}))
// delete user
userApp.put('/delete-user',expressAsyncHandler(async (req,res)=>{

    let deleteValue=req.body
    // update status for deletion operation
    await userModel.findOneAndUpdate({username:deleteValue.username},{$set:{status:false}})
    res.status(200).send({message:'status updated'})

}))

// private Routes

// add tasks
userApp.post('/addtask',verifyToken ,expressAsyncHandler(async(req,res)=>{
    let userTaskObj = req.body
    // check whether the userTask collection has username
    let taskObj = await taskModel.findOne({username:userTaskObj.username})
    // if no, create taskModel
    if(taskObj==null){
        let newUserDoc = new taskModel({...userTaskObj})
        await newUserDoc.save()
        res.send({message:'new User Added',Payload:newUserDoc})
    }
    // if yes, update model/collection
    else{
        let newTaskArray=taskObj.taskCollection
        newTaskArray.push(userTaskObj.taskCollection[0])
        await taskModel.findOneAndUpdate({username:userTaskObj.username},{$set:{taskCollection:newTaskArray}})
        res.send({message:'User Task List Updated'})
    }
}))
// view tasks
userApp.get('/viewtasks',expressAsyncHandler((req,res)=>{
    
}))



// error handling middleware

userApp.use((err,req,res,next)=>{

    res.send({message:err.message})
})




// export userApp
module.exports=userApp