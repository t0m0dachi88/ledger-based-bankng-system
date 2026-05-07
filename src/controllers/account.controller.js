const accountModel = require('../models/account.model');


async function createAccount(req, res) {
const user=req.user;
const account=new accountModel({
    user: user._id
});
await account.save();
return res.status(201).json({message:'Account created successfully',account});
}


const getUserAccount=async(req,res)=>{
    const user=req.user;
    const account=await accountModel.findOne({user:user._id});
    res.status(200).json({account});
}

module.exports = {
    createAccount,
    getUserAccount
}