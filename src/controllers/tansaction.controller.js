const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');


async function createInitianlFundTransaction(req, res) 
{
const {  toAccount, ammount, idempotencyKey } = req.body;

if(!toAccount || !ammount || !idempotencyKey)
{
    return res.status(400).json({message:'toAccount,amount and idempotencyKey are required'});

}
const toUserAccount=await accountModel.findOne({account:toAccount});
if(!toUserAccount)
{
    return res.status(404).json({message:'toAccount not found'});

}
const fromUserAccount=await accountModel.findOne({
    user:req.user._id
});

if(!fromUserAccount)
{
    return res.status(404).json({message:'System user account not found'});
}

const session=await transactionModel.startSession();
const transaction=await transactionModel.create([{
fromAccount:fromUserAccount._id,
toAccount:toUserAccount._id,
amount,
idempotencyKey,
status:'PENDING'

}],{session});

const debitLedgerEntry=await ledgerModel.create([{
    account:fromUserAccount._id,
    amount,
    transaction:transaction._id,
    type:'DEBITED'

}],{session});

const creditLedgerEntry=await ledgerModel.create([{
    account:toUserAccount._id,
    amount,
    transaction:transaction._id,
    type:'CREDITED'


}],{session});
transaction.status='COMPLETED';
await transaction.save();
await session.commitTransaction();
session.endSession();
return res.status(201).json({message:'Initial fund transaction created successfully',transactionId:transaction._id});

}





module.exports = {
    createInitianlFundTransaction
}