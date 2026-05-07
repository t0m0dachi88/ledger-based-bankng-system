const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
 userSchema.pre("save",async function(next)
{
    if(!this.isModified("password"))
    {
         return //next();
    }
  const hash=await bcrypt.hash(this.password,10);
  this.password=hash;
 return //next();
})

userSchema.methods.comparePassword=async function(password)
{
    return await bcrypt.compare(password,this.password);
}


const userModel=mongoose.model("user",userSchema);

module.exports=userModel;