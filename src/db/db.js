const mongoose=require('mongoose');

const connectDB=async()=>
{
    await mongoose.connect(process.env.DB)
    console.log("success")
}

module.exports=connectDB;

