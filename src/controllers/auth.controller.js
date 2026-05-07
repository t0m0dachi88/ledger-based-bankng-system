const mongoose=require("mongoose")
const userModel=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

async function register(req,res)
{
    const {email,password,name}=req.body
     const isExists=await userModel.findOne({email})
     if(isExists)     {
        return res.status(400).json({message:"User already exists"})
     }
        const user=await userModel.create({email,password,name})
        const token=jwt.sign({
            id:user._id,
        },process.env.JWT_SECRET,{expiresIn:"1d"})

        res.cookie("token",token,{
            httpOnly:true,
            })


        return res.status(201).json({message:"User registered successfully",token,
            user:{username:user.name,email:user.email,id:user._id}
        })
}

async function login(req,res)
{
    const {email,password}=req.body
    const user=await userModel.findOne({email})
    if(!user)
    {
        return res.status(400).json({message:"Invalid email or password"})
    }

    user.comparePassword(password).then(isMatch=>{
        if(!isMatch)
        {
            return res.status(400).json({message:"Invalid email or password"})
        }
        const token=jwt.sign({
            id:user._id,
        },process.env.JWT_SECRET,{expiresIn:"1d"})

        res.cookie("token",token,{
            httpOnly:true,
            })

        return res.status(200).json({message:"Login successful",token,
            user:{username:user.name,email:user.email,id:user._id}
        })
    })

}

module.exports = { register, login }