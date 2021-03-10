const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

//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
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: "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"
    }
}))


router.post('/register',(req,res)=>{
  const {name,email,password,mobile, dateOfBirth, gender} = req.body 
  if(!email || !password || !name || !mobile || !dateOfBirth || !gender){
     return res.status(422).json({error:"please add all the fields"})
  }
  User.findOne({email:email})
  .then((savedUser)=>{
      if(savedUser){
        return res.status(422).json({error:"user already exists with this email"})
      }
      bcrypt.hash(password,12)
      .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                mobile,
                dateOfBirth,
                gender
                
            })
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply@company.com",
                    subject:"Signup success",
                    html: "<h1>Welcome to Application, Enjoy the service</h1>"

                })
                res.json({message:"Registered successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
      })
     
  })
  .catch(err=>{
    console.log(err)
  })
})


router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"No Match found with this email"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email} = savedUser
               res.json({token,user:{_id,name,email}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.get('/fetchusers', requireLogin, (req, res, next) => {
    User.find({}).exec(function(err, userData){
        if(err) {
            res.status(400).json(err)
        } else if(!userData) {
            res.status(202).json("nodatafound")
        } else {
            res.status(200).json(userData)
        }
    })
})

router.delete('/deleteuser/:user_id', (req, res, next) => {
   console.log(req.params.user_id)
    User.deleteOne({"_id":req.params.user_id}).exec(function(err, userData){
        if(err)
            res.status(400).json(err)
        else
            res.status(200).json(userData)
    })
})


module.exports = router