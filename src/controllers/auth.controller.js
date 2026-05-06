const mongoose=require("mongoose")
const userModel=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

async function register(req,res)
{
    const {email,password,name}=req.body
     
}

module.exports = { register }