const accountModel = require('../models/account.model');


async function createAccount(req, res) {
const user=req.user;
const account=new accountModel({
    user: user._id
});
await account.save();
return res.status(201).json({message:'Account created successfully',account});
}



module.exports = {
    createAccount
}