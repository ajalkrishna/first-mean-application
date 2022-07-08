// create express app
const exp = require('express')
const app=exp()
// import dotenv
require('dotenv').config()
// import path module
const path=require('path')
// import mongoose
const mongoose=require('mongoose')

// connect angular app with backend
app.use(exp.static(path.join(__dirname,'./dist/appOne')))

const userApp = require('./userApi')

const dbConnectionUrl=process.env.DATABASE_URL

mongoose.connect(dbConnectionUrl)
.then(()=>console.log('db connection successful'))
.catch(err=>console.log('error in db connectivity',err.message))



app.use('/user',userApp)

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'dist/appOne/index.html'))
})
// port
PORT=process.env.PORT
app.listen(PORT,()=>{console.log(`app is listening to ${PORT}`)})