const mongoose=require("mongoose")
const userModel=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

async function register(req,res)
{
    const {email,password,name}=req.body
    
    try {
        const isUserAvailable=await userModel.findOne({email})
        if(isUserAvailable)
        {
            return res.status(400).json({message: "user exists"})
        }

        const hash=await bcrypt.hash(password,10)
        const newUser=await userModel.create({email,password:hash,name})

        const token=jwt.sign({userID:newUser._id},process.env.JWT_SECRET)

        res.status(200).json({user: newUser, token: token})
    } catch(error) {
        res.status(500).json({message: error.message})
    }
    
}

module.exports = { register }