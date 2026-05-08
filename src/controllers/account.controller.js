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


async function getAccountBalance(req,res)
{
    const {accountID}=req.params;
    const account=await accountModel.findById(accountID);
    if(!account)
    {
        return res.status(404).json({message:'Account not found'});
    }
    const balance=await account.getBalance();
    return res.status(200).json({balance});
}
module.exports = {
    createAccount,
    getUserAccount
}