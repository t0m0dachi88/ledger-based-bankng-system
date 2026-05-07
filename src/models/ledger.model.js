const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:true,
        index:true,
        immutable:true
    },
    ammount:{
        type:Number,
        required:true,
        immutable:true
    },
    transcation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'transaction',
        required:true,
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{values:['CREDITED','DEBITED']
        }
    }
})

function preventLedgerModification()
{
    throw new Error('Ledger entries cannot be modified or deleted');
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);
ledgerSchema.pre("updateOne",preventLedgerModification);
ledgerSchema.pre("deleteOne",preventLedgerModification);
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("remove",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);

const ledgerModel=mongoose.model('ledger',ledgerSchema);

module.exports=ledgerModel;