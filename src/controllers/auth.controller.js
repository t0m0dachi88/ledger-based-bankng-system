const mongoose=require("mongoose")
const userModel=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

async function register(req,res)
{
    const {email,password,name}=req.body
//  const isUserAvailable=userModel.findOne({email})
//  if(isUserAvailable)
//  {
//     res.status(400).json("user exists")
//  }

const hash=bcrypt.hash(password,10)
const newUser=await userModel.create({email,password,name})

const token=jwt.sign({userID:newUser._id},"592fb82847ebba5f0e29ffb96111ccdb82ab6b46c170d4cf61b29de86f62fcd8")

res.status(200).json(newUser,token)

    
}

module.exports = { register }