const mongoose = require('mongoose');

const userSchema=new mongoose.Schema
({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/]
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
},{
    timestamps:true
})

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;