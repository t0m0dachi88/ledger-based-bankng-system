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



async function createTransaction(req, res)
{

    //validate request body 
    const {fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if(!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({message:'fromAccount, toAccount, amount and idempotencyKey are required'});
  }
const fromUserAccount = await accountModel.findOne({_id:fromAccount});
const toUserAccount = await accountModel.findOne({_id:toAccount});
if(!fromUserAccount || !toUserAccount) {
    return res.status(404).json({message:'fromAccount or toAccount not found'});
}
//idempotnecy key validate
 const isTransactionExist = await transactionModel.findOne({idempotencyKey});
 if(isTransactionExist) {
    if(isTransactionExist.status === 'COMPLETED') {
        return res.status(200).json({message:'Transaction already processed',transactionId:isTransactionExist._id});
    }
    if(isTransactionExist.status === 'PENDING') {
        return res.status(200).json({message:'Transaction is being processed',transactionId:isTransactionExist._id});
    }
    if(isTransactionExist.status === 'FAILED') {
        return res.status(200).json({message:'Previous transaction attempt failed, please try again',transactionId:isTransactionExist._id});
    }

 
 }
//ACCOUNT STAT CHECK

if(fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') 
    {
       return res.status(400).json({message:'Both fromAccount and toAccount must be active'});
    }
//aggregation pipeline 
//sender sccount to balance derive
const fromAccountBalance = await fromUserAccount.getBalance();
if(fromAccountBalance < amount) {
    return res.status(400).json({message:'Insufficient balance in fromAccount'});   
}




}



module.exports = {
    createInitianlFundTransaction
}